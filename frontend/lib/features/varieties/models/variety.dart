class Variety {
  const Variety({
    required this.id,
    required this.name,
    required this.lineage,
    this.imageUrl,
    this.difficulty,
    this.version,
  });

  final String id;
  final String name;
  final String lineage;
  final String? imageUrl;
  final int? difficulty;
  final int? version;

  factory Variety.fromJson(Map<String, dynamic> json) => Variety(
        id: json['id'] as String,
        name: json['name'] as String,
        lineage: json['lineage'] as String,
        imageUrl: json['image_url'] as String?,
        difficulty: json['difficulty'] as int?,
        version: json['version'] as int?,
      );
}
