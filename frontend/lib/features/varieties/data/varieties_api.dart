import '../../../core/api/api_client.dart';
import '../models/variety.dart';

class VarietiesApi {
  VarietiesApi(this.client);

  final ApiClient client;

  Future<List<Variety>> list({String? search, String? lineage}) async {
    final response = await client.dio.get('/varieties', queryParameters: {
      if (search != null && search.isNotEmpty) 'search': search,
      if (lineage != null && lineage.isNotEmpty) 'lineage': lineage,
    });
    final data = response.data as Map<String, dynamic>;
    final items = data['varieties'] as List<dynamic>;
    return items.map((item) => Variety.fromJson(item as Map<String, dynamic>)).toList();
  }
}
