data "aws_route53_zone" "base_domain" {
  name = "ogin.io"
}

resource "aws_route53_record" "domain" {
  zone_id = data.aws_route53_zone.base_domain.zone_id
  name    = "umob.ogin.io"
  type    = "A"

  alias {
    name                   = aws_alb.lb.dns_name
    zone_id                = aws_alb.lb.zone_id
    evaluate_target_health = true
  }
}
