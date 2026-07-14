export interface LegalSection {
  title: string
  paragraphs: string[]
}

export interface LegalDocument {
  title: string
  sections: LegalSection[]
}

export const LEGAL_PROFILE = Object.freeze({
  operatorName: '新建区小杨哥节能门窗经营部',
  contactEmail: 'i@WindoorsY.com',
  retentionPeriod: '自最后一次预约服务完成之日起保存 2 年；法律法规另有要求的除外',
  securityLogRetentionPeriod: '自生成之日起保存 2 年；法律法规另有要求的除外',
  accountLoginRetentionPeriod: '账号存续期间保留，账号注销后依法删除或匿名化',
  version: '1.0',
  effectiveDate: '2026年7月13日',
})

export const SERVICE_AGREEMENT: LegalDocument = {
  title: '用户服务协议',
  sections: [
    {
      title: '一、协议适用范围',
      paragraphs: [
        `本协议由用户与${LEGAL_PROFILE.operatorName}共同订立，适用于本小程序提供的门窗产品、施工案例、服务人员信息展示、电话联系、微信登录和预约咨询服务。`,
        '本小程序首版不提供商品下单、在线支付、配送、交易担保或第三方商户入驻服务。',
      ],
    },
    {
      title: '二、账号与预约',
      paragraphs: [
        '公开内容无需登录即可浏览。用户提交预约前需要完成微信登录，并提供真实、准确、有效的姓名、手机号、城市和需求描述。',
        '预约提交成功仅表示我们已收到咨询需求，不代表双方已经签订门窗销售、安装或施工合同；具体方案、价格、工期和责任以双方另行确认的书面文件为准。',
      ],
    },
    {
      title: '三、用户行为规范',
      paragraphs: [
        '用户不得冒用他人身份、提交违法或侵权内容、恶意重复提交、干扰系统运行、绕过访问控制或利用本服务从事违法活动。',
        '因用户提供的信息不真实、不准确或无法联系导致服务无法进行的，相应后果由用户承担。',
      ],
    },
    {
      title: '四、内容与知识产权',
      paragraphs: [
        '小程序中的文字、图片、页面设计和软件代码受相关法律保护。未经权利人授权，不得复制、传播、改编或用于其他商业用途。',
        '案例和服务信息可能因现场条件、产品更新或经营安排发生变化，最终服务内容以双方实际确认结果为准。',
      ],
    },
    {
      title: '五、服务变更与责任边界',
      paragraphs: [
        '因系统维护、网络故障、微信平台或云服务异常、不可抗力等原因，服务可能暂时中断；我们将尽合理努力恢复。',
        '在法律允许的范围内，我们对超出合理控制范围的服务中断不承担责任，但不会排除依法不得限制或免除的责任。',
      ],
    },
    {
      title: '六、协议更新与联系',
      paragraphs: [
        `本协议版本为 ${LEGAL_PROFILE.version}，自 ${LEGAL_PROFILE.effectiveDate} 起生效。业务功能或规则发生重大变化时，我们将更新协议并依法提示用户。`,
        `如有疑问、投诉或争议，请发送邮件至 ${LEGAL_PROFILE.contactEmail}。`,
      ],
    },
  ],
}

export const PRIVACY_POLICY: LegalDocument = {
  title: '隐私政策',
  sections: [
    {
      title: '一、我们处理的信息',
      paragraphs: [
        '用户主动登录时，我们通过微信登录和 uni-id 处理必要的微信登录账号标识，用于识别预约用户、维持登录状态、鉴权和防止重复提交。',
        '用户主动提交预约时，我们处理姓名、手机号、城市、需求描述、预约来源、提交时间和处理状态，用于联系用户、判断服务区域、安排咨询、跟进服务和处理争议。',
        '为保障登录与账号安全，uni-id 会记录账号安全日志：客户端应用标识 appid、设备标识 device_id、IP 地址 ip、登录或账号操作类型 type、User-Agent/设备信息 ua、日志生成时间 create_date、成功或失败结果 state，以及日志涉及时的关联账号字段 user_id、username、email、mobile。上述信息用于故障定位、安全审计和防止滥用。',
        '登录成功后，uni-id 还会在账号记录中更新最后登录时间 last_login_date 和最后登录 IP last_login_ip，用于账号安全核验、异常登录排查和安全审计。',
      ],
    },
    {
      title: '二、信息使用方式',
      paragraphs: [
        '上述信息仅用于完成预约服务、保障系统安全和履行法定义务。我们不会出售个人信息，也不会将预约信息用于与本次服务无关的营销。',
        '门店管理员只能访问本门店预约；经授权的平台管理员仅在运营、安全审计、投诉或故障处理所必需的范围内访问。无完整查看权限的后台列表显示脱敏手机号。',
      ],
    },
    {
      title: '三、存储期限与保护',
      paragraphs: [
        `预约信息${LEGAL_PROFILE.retentionPeriod}。达到保存期限或处理目的后，我们将删除或匿名化处理。`,
        `登录安全日志${LEGAL_PROFILE.securityLogRetentionPeriod}，期限届满后删除或匿名化；账号中的最后登录时间 last_login_date 和最后登录 IP last_login_ip 在${LEGAL_PROFILE.accountLoginRetentionPeriod}。法律法规要求延长保存的，从其规定。`,
        '信息存储于正式使用的 uniCloud 阿里云服务空间。我们采用服务端鉴权、门店数据隔离、敏感集合禁止客户端直写、最小权限和手机号脱敏等措施保护信息。',
      ],
    },
    {
      title: '四、共享与委托处理',
      paragraphs: [
        '为完成登录和云端服务，微信、uni-id 及 uniCloud 阿里云会在各自职责范围内处理必要信息。除完成用户明确请求、取得授权或法律法规要求外，我们不向其他第三方提供个人信息。',
      ],
    },
    {
      title: '五、权限说明',
      paragraphs: [
        '首版不调用设备定位接口。预约中的城市由用户手工填写，不属于设备精确位置信息。',
        '首版不申请相册、摄像头或麦克风权限。用户可以在不登录的情况下浏览公开内容。',
      ],
    },
    {
      title: '六、用户权利',
      paragraphs: [
        `用户可以通过 ${LEGAL_PROFILE.contactEmail} 申请查询、更正、复制或删除预约信息，撤回同意，或申请注销账号。我们会在核验身份后依法处理和反馈。`,
        '撤回同意不影响撤回前处理活动的合法性；拒绝或撤回后仍可浏览公开内容，但不能继续使用需要登录的预约功能。',
      ],
    },
    {
      title: '七、未成年人',
      paragraphs: [
        '本服务面向具有相应民事行为能力的门窗服务需求者。未成年人应在监护人指导和同意下使用；发现未经监护人同意处理的信息后，我们将依法处置。',
      ],
    },
    {
      title: '八、更新与联系',
      paragraphs: [
        `本政策版本为 ${LEGAL_PROFILE.version}，自 ${LEGAL_PROFILE.effectiveDate} 起生效。处理目的、信息类型或第三方发生重大变化时，我们将更新政策并依法重新告知。`,
        `运营者：${LEGAL_PROFILE.operatorName}；联系邮箱：${LEGAL_PROFILE.contactEmail}。`,
      ],
    },
  ],
}
