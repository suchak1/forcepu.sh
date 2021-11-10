enum GymActionEnum {
  Reject = 'reject'
}

enum GymTypeEnum {
  Email = 'Email',
  Attachment = 'Attachment',
  SDK = 'SDK',
  CSE = 'CSE'
}

export interface GymAction {
  type: GymActionEnum
}

export interface GymPolicy {
  id: number,
  name: string,
  type: GymTypeEnum
  createdBy: string,
  createdOn: Date
}

export interface GymStreamlet {
  id: number,
  date: Date,
  action: GymAction,
  user: string,
  policy: GymPolicy
}