import '../../../core/api/api_client.dart';
import '../models/container.dart';

class ContainersApi {
  ContainersApi(this.client);

  final ApiClient client;

  Future<List<Container>> list() async {
    final response = await client.dio.get('/containers');
    final data = response.data as Map<String, dynamic>;
    final items = data['containers'] as List<dynamic>;
    return items.map((item) => Container.fromJson(item as Map<String, dynamic>)).toList();
  }
}
