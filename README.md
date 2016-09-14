audit AWS
============================
This stack will monitor supported AWS services and alert on things CloudCoreo developers think are violations of best practices


## Description

This repo is designed to work with CloudCoreo. It will monitor all supported AWS services against best practices for you and send a report to the email address designated by the config.yaml AUDIT_AWS_ALERT_RECIPIENT value

## Variables Requiring Your Input

### `AUDIT_AWS_ALERT_RECIPIENT`:
  * description: email recipient for notification

## Variables Required but Defaulted

### `AUDIT_AWS_ALERT_RECIPIENT`:
  * description: email recipient for notification

### `AUDIT_AWS_ALLOW_EMPTY`:
  * description: receive empty reports?

### `AUDIT_AWS_SEND_ON`:
  * description: always or change
  * default: change

### `AUDIT_AWS_PAYLOAD_TYPE`:
  * description: json or text
  * default: json

### `AUDIT_AWS_CLOUDTRAIL_ALERT_LIST`:
  * description: alert list for generating notifications
  * default: cloudtrail-service-disabled

### `AUDIT_AWS_REDSHIFT_ALERT_LIST`:
  * description: alert list for generating notifications
  * default: redshift-publicly-accessible,redshift-encrypted,redshift-no-version-upgrade,redshift-no-require-ssl,redshift-no-user-logging

### `AUDIT_AWS_RDS_ALERT_LIST`:
  * description: alert list for generating notifications
  * default: rds-short-backup-retention-period

### `AUDIT_AWS_IAM_ALERT_LIST`:
  * description: alert list for generating notifications
  * default: iam-unusediamgroup,iam-inactive-key-no-rotation,iam-active-key-no-rotation,iam-passwordreuseprevention,iam-missing-password-policy,iam-expirepasswords,iam-no-mfa,iam-root-no-mfa,iam-root-active-key,iam-root-active-password,iam-user-attached-policies

### `AUDIT_AWS_ELB_ALERT_LIST`:
  * description: alert list for generating notifications
  * default: elb-old-ssl-policy

### `AUDIT_AWS_EC2_ALERT_LIST`:
  * description: alert list for generating notifications
  * default: ec2-ip-address-whitelisted,ec2-unrestricted-traffic,ec2-TCP-1521-0.0.0.0/0,ec2-TCP-3306-0.0.0.0/0,ec2-TCP-5432-0.0.0.0/0,ec2-TCP-27017-0.0.0.0/0,ec2-TCP-1433-0.0.0.0/0,ec2-TCP-3389-0.0.0.0/0,ec2-TCP-22-0.0.0.0/0,ec2-TCP-5439-0.0.0.0/0,ec2-TCP-23,ec2-TCP-21,ec2-TCP-20,ec2-ports-range

### `AUDIT_AWS_S3_ALERT_LIST`:
  * description: alert list for generating notifications
  * default: s3-allusers-write,s3-allusers-write-acp,s3-allusers-read,s3-authenticatedusers-write,s3-authenticatedusers-write-acp,s3-authenticatedusers-read,s3-logging-disabled,s3-world-open-policy-delete,s3-world-open-policy-get,s3-world-open-policy-list,s3-world-open-policy-put,s3-world-open-policy-all,s3-only-ip-based-policy

### `AUDIT_AWS_REGIONS`:
  * description: list of AWS regions to check. Default is all regions
  * default: us-east-1,us-west-1,us-west-2

## Variables Not Required

**None**

## Tags

1. Audit
1. Best Practices
1. Alert
1. AWS

## Diagram



## Icon



