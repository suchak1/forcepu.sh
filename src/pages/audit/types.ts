enum AuditActionEnum {
  Reject = 'reject'
}

enum AuditTypeEnum {
  Email = 'Email',
  Attachment = 'Attachment',
  SDK = 'SDK',
  CSE = 'CSE'
}

export interface AuditAction {
  type: AuditActionEnum
}

export interface AuditPolicy {
  id: number,
  name: string,
  type: AuditTypeEnum
  createdBy: string,
  createdOn: Date
}

export interface AuditStreamlet {
  id: number,
  date: Date,
  action: AuditAction,
  user: string,
  policy: AuditPolicy
}