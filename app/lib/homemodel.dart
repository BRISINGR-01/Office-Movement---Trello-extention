import 'package:flutterflow_ui/flutterflow_ui.dart';
import 'package:flutter/material.dart';
import 'main.dart' show MainWidget;
import 'package:http/http.dart' as http;

class MainModel extends FlutterFlowModel<MainWidget> {
  ///  State fields for stateful widgets in this page.

  final unfocusNode = FocusNode();

  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode;
  TextEditingController? textController;
  var URL = 'http://localhost:3000';
  var image = Image(
      image: AssetImage('assets/snacktafel.png'),
      height: 400,
      width: 300,
      fit: BoxFit.cover);
  var selectedTask = 1;
  var qrResult = '1';

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

    //UNLOCK TASK
    var data = completeTask(qrResult);

    data.then((value) {
      if (value.statusCode == 200) {
        print(value.body);
      } else {}
    });

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

  Future<http.Response> fetchTask() {
    return http.get(Uri.parse(URL + '/data/?id=' + qrResult));
  }

  Future<http.Response> completeTask(String id) {
    return http.post(Uri.parse(URL + '/data/?id=' + id));
  }

  Future<http.Response> lockTask(String id) {
    return http.post(Uri.parse(URL + '/lock/?id=' + id));
  }

  /// Action blocks are added here.

  /// Additional helper methods are added here.
}
