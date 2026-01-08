import 'package:flutter/material.dart';

class ContainerEditScreen extends StatelessWidget {
  const ContainerEditScreen({super.key, this.containerId});

  final String? containerId;

  @override
  Widget build(BuildContext context) {
    final isNew = containerId == null;
    return Scaffold(
      appBar: AppBar(
        title: Text(isNew ? 'New Container' : 'Edit Container'),
      ),
      body: const Center(child: Text('Container form')),
    );
  }
}
