class ContainerVariety {
  const ContainerVariety({
    required this.varietyId,
    required this.varietyName,
    required this.count,
  });

  final String varietyId;
  final String varietyName;
  final int count;

  factory ContainerVariety.fromJson(Map<String, dynamic> json) => ContainerVariety(
        varietyId: json['variety_id'] as String,
        varietyName: json['variety_name'] as String,
        count: json['count'] as int,
      );
}
