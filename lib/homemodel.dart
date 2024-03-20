import 'package:flutterflow_ui/flutterflow_ui.dart';
import 'package:flutter/material.dart';
import 'main.dart' show MainWidget;

class MainModel extends FlutterFlowModel<MainWidget> {
  ///  State fields for stateful widgets in this page.

  final unfocusNode = FocusNode();
  var qrResult = '';

  /// Initialization and disposal methods.

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    unfocusNode.dispose();
  }

  void qrCodeWasScanned(
    BuildContext context,
  ) {
    //We want to check which QR code we scanned, validate it and then unlock the task.

    showDialog(
        context: context,
        builder: (alertDialogContext) {
          return AlertDialog(
            title: Text('Hint'),
            content: Text('Your task has unlocked!'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(alertDialogContext),
                child: Text('Cool!'),
              ),
            ],
          );
        });
  }

  /// Action blocks are added here.

  /// Additional helper methods are added here.
}
