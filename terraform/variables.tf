variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  default     = "angular2-hn"
}

variable "environment" {
  description = "Deployment environment"
  default     = "production"
}
