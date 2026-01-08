import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class VarietyDetailScreen extends StatelessWidget {
  const VarietyDetailScreen({super.key, required this.varietyId});

  final String varietyId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Variety Detail'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => context.go('/varieties/$varietyId/edit'),
          ),
        ],
      ),
      body: Center(child: Text('Variety: $varietyId')),
    );
  }
}
