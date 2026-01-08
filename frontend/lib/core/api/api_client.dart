import 'package:dio/dio.dart';
import '../auth/token_storage.dart';

class ApiClient {
  ApiClient({required this.tokenStorage}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: const String.fromEnvironment('API_BASE_URL',
            defaultValue: 'https://medaka-api-xxxxx.run.app/v1'),
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 15),
      ),
    );

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await tokenStorage.readToken();
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }

  late final Dio _dio;
  final TokenStorage tokenStorage;

  Dio get dio => _dio;
}
