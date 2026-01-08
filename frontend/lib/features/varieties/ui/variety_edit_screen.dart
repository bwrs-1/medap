import 'package:flutter/material.dart';

class VarietyEditScreen extends StatelessWidget {
  const VarietyEditScreen({super.key, this.varietyId});

  final String? varietyId;

  @override
  Widget build(BuildContext context) {
    final isNew = varietyId == null;
    return Scaffold(
      appBar: AppBar(
        title: Text(isNew ? 'New Variety' : 'Edit Variety'),
      ),
      body: const Center(child: Text('Variety form')),
    );
  }
}
