import 'dart:convert';

class Task {
  Task({
    required this.id,
    required this.done,
    required this.task,
    required this.hint,
  });

  int id;
  bool done;
  String task;
  String hint;
}
