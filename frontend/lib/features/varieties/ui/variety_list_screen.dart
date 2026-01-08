import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class VarietyListScreen extends StatelessWidget {
  const VarietyListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Varieties'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.go('/varieties/new'),
          ),
        ],
      ),
      body: const Center(child: Text('Variety list')), 
    );
  }
}
