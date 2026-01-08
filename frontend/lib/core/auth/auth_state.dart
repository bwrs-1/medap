import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_service.dart';
import 'token_storage.dart';

class AuthState {
  const AuthState({required this.isAuthenticated});
  final bool isAuthenticated;
}

class AuthController extends StateNotifier<AuthState> {
  AuthController({required this.authService, required this.tokenStorage})
      : super(const AuthState(isAuthenticated: false));

  final AuthService authService;
  final TokenStorage tokenStorage;

  Future<void> signIn() async {
    final idToken = await authService.getIdToken();
    if (idToken == null) {
      return;
    }
    // TODO: Exchange idToken for JWT via backend.
    await tokenStorage.writeToken(idToken);
    state = const AuthState(isAuthenticated: true);
  }

  Future<void> signOut() async {
    await authService.signOut();
    await tokenStorage.clearToken();
    state = const AuthState(isAuthenticated: false);
  }
}

final tokenStorageProvider = Provider<TokenStorage>((ref) => TokenStorage());
final authServiceProvider = Provider<AuthService>((ref) => AuthService());
final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(
    authService: ref.read(authServiceProvider),
    tokenStorage: ref.read(tokenStorageProvider),
  );
});
