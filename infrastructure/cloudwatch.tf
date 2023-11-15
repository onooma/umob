resource "aws_cloudwatch_log_group" "umob_log_group" {
  name = "umob-log-group"

  tags = {
    Environment = "prd"
  }
}

resource "aws_cloudwatch_log_stream" "umob_log_stream" {
  name           = "umob-log-stream"
  log_group_name = aws_cloudwatch_log_group.umob_log_group.name
}
