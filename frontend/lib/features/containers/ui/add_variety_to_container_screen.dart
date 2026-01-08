import 'package:flutter/material.dart';

class AddVarietyToContainerScreen extends StatelessWidget {
  const AddVarietyToContainerScreen({super.key, required this.containerId});

  final String containerId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Variety')),
      body: Center(child: Text('Add variety to $containerId')),
    );
  }
}
