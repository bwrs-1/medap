import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ContainerDetailScreen extends StatelessWidget {
  const ContainerDetailScreen({super.key, required this.containerId});

  final String containerId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Container Detail'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => context.go('/containers/$containerId/edit'),
          ),
        ],
      ),
      body: Center(child: Text('Container: $containerId')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/containers/$containerId/add-variety'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
