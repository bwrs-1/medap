class Container {
  const Container({
    required this.id,
    required this.name,
    this.size,
    this.location,
    this.memo,
    this.version,
  });

  final String id;
  final String name;
  final String? size;
  final String? location;
  final String? memo;
  final int? version;

  factory Container.fromJson(Map<String, dynamic> json) => Container(
        id: json['id'] as String,
        name: json['name'] as String,
        size: json['size'] as String?,
        location: json['location'] as String?,
        memo: json['memo'] as String?,
        version: json['version'] as int?,
      );
}
