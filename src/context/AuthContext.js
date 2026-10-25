import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";
import * as authService from "../services/authService";
import STORAGE_KEYS from "../constants/storageKeys";
import { getErrorMessage } from "../utils/errorHandler";
import { getObject, removeMany, setObject } from "../utils/storage";

/**
 * Owns the customer session. Orders are a protected endpoint, so nothing in
 * the ordering flow works without a token held here.
 */

const initialState = {
  user: null,
  token: null,
  /** True until the persisted session has been read back from storage. */
  isRestoring: true,
  isSubmitting: false,
  error: null,
};

const ACTIONS = {
  RESTORE: "RESTORE",
  SUBMIT_START: "SUBMIT_START",
  SUBMIT_ERROR: "SUBMIT_ERROR",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  SET_USER: "SET_USER",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.RESTORE:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isRestoring: false,
      };
    case ACTIONS.SUBMIT_START:
      return { ...state, isSubmitting: true, error: null };
    case ACTIONS.SUBMIT_ERROR:
      return { ...state, isSubmitting: false, error: action.payload };
    case ACTIONS.SIGN_IN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isSubmitting: false,
        error: null,
      };
    case ACTIONS.SIGN_OUT:
      return { ...initialState, isRestoring: false };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    await removeMany([STORAGE_KEYS.authToken, STORAGE_KEYS.authUser]);
    dispatch({ type: ACTIONS.SIGN_OUT });
  }, []);

  /** Persist + activate a session returned by /register or /login. */
  const applySession = useCallback(async (session) => {
    setAuthToken(session.token);
    await Promise.all([
      setObject(STORAGE_KEYS.authToken, session.token),
      setObject(STORAGE_KEYS.authUser, session.user),
    ]);
    dispatch({ type: ACTIONS.SIGN_IN, payload: session });
  }, []);

  // Restore a previous session on cold start.
  useEffect(() => {
    const restoreSession = async () => {
      const [token, user] = await Promise.all([
        getObject(STORAGE_KEYS.authToken),
        getObject(STORAGE_KEYS.authUser),
      ]);

      if (token) {
        setAuthToken(token);
      }

      if (isMounted.current) {
        dispatch({
          type: ACTIONS.RESTORE,
          payload: { token: token || null, user: user || null },
        });
      }
    };

    restoreSession();
  }, []);

  // A 401 from any request means the stored token is no longer usable.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
    });

    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const runAuthRequest = useCallback(
    async (request) => {
      dispatch({ type: ACTIONS.SUBMIT_START });

      try {
        const session = await request();
        await applySession(session);

        return { success: true };
      } catch (error) {
        const message = getErrorMessage(error);

        if (isMounted.current) {
          dispatch({ type: ACTIONS.SUBMIT_ERROR, payload: message });
        }

        return { success: false, message };
      }
    },
    [applySession]
  );

  const signIn = useCallback(
    (credentials) => runAuthRequest(() => authService.login(credentials)),
    [runAuthRequest]
  );

  const signUp = useCallback(
    (details) => runAuthRequest(() => authService.register(details)),
    [runAuthRequest]
  );

  /** Refreshes the cached profile; silently ignored if it fails. */
  const refreshProfile = useCallback(async () => {
    try {
      const user = await authService.fetchProfile();

      if (isMounted.current && user) {
        dispatch({ type: ACTIONS.SET_USER, payload: user });
        await setObject(STORAGE_KEYS.authUser, user);
      }
    } catch (error) {
      // A 401 is already handled by the client interceptor.
    }
  }, []);

  /**
   * Saves name/phone changes and keeps the cached profile in sync. Throws on
   * failure so the calling form can show the backend's message.
   */
  const updateProfile = useCallback(async (updates) => {
    const user = await authService.updateProfile(updates);

    if (user) {
      await setObject(STORAGE_KEYS.authUser, user);

      if (isMounted.current) {
        dispatch({ type: ACTIONS.SET_USER, payload: user });
      }
    }

    return user;
  }, []);

  const clearError = useCallback(
    () => dispatch({ type: ACTIONS.CLEAR_ERROR }),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token),
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
      clearError,
    }),
    [state, signIn, signUp, signOut, refreshProfile, updateProfile, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
