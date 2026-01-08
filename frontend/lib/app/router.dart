import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/common/app_scaffold.dart';
import '../features/varieties/ui/variety_detail_screen.dart';
import '../features/varieties/ui/variety_edit_screen.dart';
import '../features/varieties/ui/variety_list_screen.dart';
import '../features/containers/ui/container_detail_screen.dart';
import '../features/containers/ui/container_edit_screen.dart';
import '../features/containers/ui/container_list_screen.dart';
import '../features/containers/ui/add_variety_to_container_screen.dart';
import '../features/settings/settings_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/varieties',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return AppScaffold(navigationShell: navigationShell);
      },
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/varieties',
              builder: (context, state) => const VarietyListScreen(),
              routes: [
                GoRoute(
                  path: 'new',
                  builder: (context, state) => const VarietyEditScreen(),
                ),
                GoRoute(
                  path: ':id',
                  builder: (context, state) => VarietyDetailScreen(
                    varietyId: state.pathParameters['id']!,
                  ),
                  routes: [
                    GoRoute(
                      path: 'edit',
                      builder: (context, state) => VarietyEditScreen(
                        varietyId: state.pathParameters['id']!,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/containers',
              builder: (context, state) => const ContainerListScreen(),
              routes: [
                GoRoute(
                  path: 'new',
                  builder: (context, state) => const ContainerEditScreen(),
                ),
                GoRoute(
                  path: ':id',
                  builder: (context, state) => ContainerDetailScreen(
                    containerId: state.pathParameters['id']!,
                  ),
                  routes: [
                    GoRoute(
                      path: 'edit',
                      builder: (context, state) => ContainerEditScreen(
                        containerId: state.pathParameters['id']!,
                      ),
                    ),
                    GoRoute(
                      path: 'add-variety',
                      builder: (context, state) => AddVarietyToContainerScreen(
                        containerId: state.pathParameters['id']!,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => const SettingsScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
