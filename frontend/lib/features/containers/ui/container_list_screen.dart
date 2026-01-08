import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ContainerListScreen extends StatelessWidget {
  const ContainerListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Containers'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.go('/containers/new'),
          ),
        ],
      ),
      body: const Center(child: Text('Container list')),
    );
  }
}
