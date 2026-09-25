import { useState } from "react";
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Smartphone, 
  Globe, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Coins, 
  CreditCard,
  Percent,
  Sparkles,
  ChevronRight,
  Info,
  Gift,
  Copy,
  Check
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import clsx from "clsx";

interface BrokerItem {
  id: string;
  name: string;
  nativeName: string;
  category: "lsx" | "global" | "crypto";
  badge: string;
  avatar: string;
  avatarBg: string;
  license: string;
  markets: string[];
  description: {
    lo: string;
    th: string;
    en: string;
    zh: string;
  };
  highlights: {
    lo: string[];
    th: string[];
    en: string[];
    zh: string[];
  };
  fees: {
    lo: string;
    th: string;
    en: string;
    zh: string;
  };
  minDeposit: {
    lo: string;
    th: string;
    en: string;
    zh: string;
  };
  depositMethods: {
    lo: string;
    th: string;
    en: string;
    zh: string;
  };
  platforms: string[];
  website: string;
  openAccountUrl?: string;
  referralUrl?: string;
  referralCode?: string;
  referralBonus?: {
    lo: string;
    th: string;
    en: string;
    zh: string;
  };
  contact?: {
    phone?: string;
    address?: string;
  };
}

const BROKERS_DATA: BrokerItem[] = [
  {
    id: "bcel-kt",
    name: "BCEL-KT Securities Co., Ltd.",
    nativeName: "ບໍລິສັດ ຫຼັກຊັບ ທຄຕລ-KT ຈຳກັດ",
    category: "lsx",
    badge: "LSX ອັນດັບ 1",
    avatar: "BCEL-KT",
    avatarBg: "from-blue-600 to-red-600",
    license: "ສຳນັກງານ ຄະນະກຳມະການຄຸ້ມຄອງຫຼັກຊັບ (ສຄລ)",
    markets: ["LSX Stocks (BCEL, EDL-Gen, PTL, SVN...)", "ພັນທະບັດລັດຖະບານ", "BCEL One Integration"],
    description: {
      lo: "ບໍລິສັດຫຼັກຊັບຊັ້ນນຳອັນດັບ 1 ຂອງ ສປປ ລາວ ຮ່ວມທຶນລະຫວ່າງ ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL) ແລະ KT ZMICO Securities. ສະດວກທີ່ສຸດຍ້ອນເຊື່ອມຕໍ່ກັບແອັບ BCEL One ໂດຍກົງ.",
      th: "บริษัทหลักทรัพย์ชั้นนำอันดับ 1 ของ สปป. ลาว ร่วมทุนระหว่างธนาคารการค้าต่างประเทศลาว (BCEL) และ KT ZMICO สะดวกที่สุดด้วยการเชื่อมต่อกับแอป BCEL One โดยตรง",
      en: "The leading No.1 securities firm in Lao PDR, a joint venture between Banque Pour Le Commerce Exterieur Lao (BCEL) and KT ZMICO. Offers seamless direct integration with BCEL One app.",
      zh: "老挝第一大证券公司，由老挝外贸银行 (BCEL) 与泰国 KT ZMICO 合资设立。深度集成 BCEL One 手机银行，开户与转账最便捷。",
    },
    highlights: {
      lo: [
        "ເປີດບັນຊີ ແລະ ຝາກ-ຖອນເງິນໄດ້ທັນທີຜ່ານແອັບ BCEL One",
        "ມີສ່ວນແບ່ງຕະຫຼາດ (Market Share) ສູງທີ່ສຸດໃນຕະຫຼາດຫຼັກຊັບລາວ",
        "ຮອງຮັບການເທຣດຜ່ານລະບົບອອນລາຍ ແລະ ແອັບ LSX Mobile",
        "ມີທີມງານຊ່ຽວຊານໃຫ້ຄຳປຶກສາການລົງທຶນພາສາລາວ",
      ],
      th: [
        "เปิดบัญชีและฝาก-ถอนเงินได้ทันทีผ่านแอป BCEL One",
        "มีส่วนแบ่งตลาดสูงสุดในตลาดหลักทรัพย์ลาว (LSX)",
        "รองรับการเทรดผ่านระบบออนไลน์และแอป LSX Mobile",
        "มีทีมงานผู้เชี่ยวชาญให้คำปรึกษาการลงทุนเป็นภาษาลาว",
      ],
      en: [
        "Instant account opening & fund deposits directly via BCEL One app",
        "Highest trading volume & market share on Lao Securities Exchange (LSX)",
        "Trade online via web browser and LSX Mobile app",
        "Dedicated advisory team offering research and customer support in Lao",
      ],
      zh: [
        "支持直接在 BCEL One 手机银行内申请开户及实时转账",
        "在老挝证券交易所 (LSX) 拥有最高市场份额与交易量",
        "支持网页端及 LSX Mobile 移动端在线下单交易",
        "拥有专业投研团队提供老挝语、英语投资咨询",
      ],
    },
    fees: {
      lo: "~0.44% ຂອງມູນຄ່າການຊື້ຂາຍ (ລວມຄ່າທຳນຽມ ສຄລ + LSX)",
      th: "~0.44% ของมูลค่าการซื้อขาย (รวมค่าธรรมเนียม LSC + LSX)",
      en: "~0.44% per transaction (inclusive of LSC + LSX regulatory fees)",
      zh: "约 0.44% / 笔交易 (含老挝证监会与交易所综合规费)",
    },
    minDeposit: {
      lo: "ບໍ່ມີຂັ້ນຕ່ຳ (0 ກີບ) — ເລີ່ມຕົ້ນຊື້ຂາຍຕາມລາຄາຫຸ້ນ",
      th: "ไม่มีขั้นต่ำ (0 กีบ) — เริ่มต้นซื้อขายตามราคาหุ้นจริง",
      en: "No minimum deposit (0 LAK) — Start trading at stock price",
      zh: "无最低入金门槛 (0 基普) — 按单手股票实际价格买入",
    },
    depositMethods: {
      lo: "ແອັບ BCEL One (ຕັດບັນຊີທັນທີ) ຫຼື ສາຂາ BCEL ທົ່ວປະເທດ",
      th: "แอป BCEL One (หักบัญชีทันที) หรือเคาน์เตอร์ธนาคาร BCEL ทั่วประเทศ",
      en: "BCEL One app (Instant deduction) or any BCEL branch nationwide",
      zh: "BCEL One 手机银行即时转账，或老挝外贸银行线下各营业网点",
    },
    platforms: ["BCEL One (Securities Menu)", "LSX Mobile", "HTS / WTS Web Trading"],
    website: "https://www.bcel-kt.com",
    contact: {
      phone: "+856 21 265 484 / 265 485",
      address: "ອາຄານຕະຫຼາດຫຼັກຊັບລາວ (LSX), ຊັ້ນ 7, ຖະໜົນກຳແພງເມືອງ, ບ້ານໂພນທັນ, ນະຄອນຫຼວງວຽງຈັນ",
    },
  },
  {
    id: "lcs",
    name: "Lao-China Securities Co., Ltd.",
    nativeName: "ບໍລິສັດ ຫຼັກຊັບ ລາວ-ຈີນ ຈຳກັດ",
    category: "lsx",
    badge: "ຮ່ວມທຶນ ລາວ-ຈີນ",
    avatar: "LCS",
    avatarBg: "from-amber-600 to-red-700",
    license: "ສຳນັກງານ ຄະນະກຳມະການຄຸ້ມຄອງຫຼັກຊັບ (ສຄລ)",
    markets: ["LSX Stocks", "ທີ່ປຶກສາທາງການເງິນ (IB)", "ການລົງທຶນຂ້າມແດນ"],
    description: {
      lo: "ບໍລິສັດຫຼັກຊັບຮ່ວມທຶນລະຫວ່າງ ລາວ ແລະ ຈີນ (Pacific Securities). ໂດດເດັ່ນດ້ານການບໍລິການນັກລົງທຶນທັງພາຍໃນ ແລະ ຕ່າງປະເທດ ພ້ອມບົດວິເຄາະຫຼາຍພາສາ.",
      th: "บริษัทหลักทรัพย์ร่วมทุนระหว่างลาวและจีน (Pacific Securities) โดดเด่นด้านการบริการนักลงทุนทั้งในและต่างประเทศ พร้อมบทวิเคราะห์หลายภาษา",
      en: "Joint-venture securities firm between Lao and Chinese institutions (Pacific Securities). Excellent cross-border investment services with multi-language research reports.",
      zh: "中老合资证券公司 (太平洋证券与老挝合资)。专注中老跨境资本服务，提供中、老、英多语言研究报告与投资咨询。",
    },
    highlights: {
      lo: [
        "ມີບົດວິເຄາະ ແລະ ການໃຫ້ຄຳປຶກສາເປັນ ພາສາລາວ, ຈີນ ແລະ ອັງກິດ",
        "ຊ່ວຍເຫຼືອນັກລົງທຶນຕ່າງປະເທດໃນການເປີດບັນຊີເທຣດຫຸ້ນລາວ",
        "ບໍລິການວານິດທະນະກິດ (Investment Banking) ແລະ ທີ່ປຶກສານຳບໍລິສັດເຂົ້າຕະຫຼາດ",
        "ລະບົບເທຣດຜ່ານອິນເຕີເນັດສະດວກ",
      ],
      th: [
        "มีบทวิเคราะห์และบริการให้คำปรึกษาเป็น ภาษาลาว, จีน และอังกฤษ",
        "ช่วยเหลือนักลงทุนต่างชาติในการเปิดบัญชีเทรดหุ้นลาว",
        "บริการวาณิชธนกิจ (IB) และที่ปรึกษาการนำบริษัทเข้าจดทะเบียน",
        "ระบบเทรดออนไลน์ใช้งานง่าย",
      ],
      en: [
        "Research reports and client support in Lao, Chinese, and English",
        "Specialized onboarding and assistance for foreign/expat investors in LSX",
        "Strong Investment Banking (IB) advisory and IPO underwriting capabilities",
        "Convenient Web-based order execution system",
      ],
      zh: [
        "提供老挝语、中文及英语多语言投研分析与客服支持",
        "专门协助外国投资者（尤其是中资背景）开立老挝股票账户",
        "拥有强大的老挝本土企业 IPO 保荐承销与投行咨询能力",
        "稳定高效的网上交易系统",
      ],
    },
    fees: {
      lo: "~0.44% ຂອງມູນຄ່າການຊື້ຂາຍ",
      th: "~0.44% ของมูลค่าการซื้อขาย",
      en: "~0.44% per transaction",
      zh: "约 0.44% / 笔交易",
    },
    minDeposit: {
      lo: "ບໍ່ມີຂັ້ນຕ່ຳ (0 ກີບ)",
      th: "ไม่มีขั้นต่ำ (0 กีบ)",
      en: "No minimum deposit",
      zh: "无最低入金门槛",
    },
    depositMethods: {
      lo: "ໂອນຜ່ານບັນຊີທະນາຄານໃນລາວ (BCEL, JDB, LDB...)",
      th: "โอนผ่านบัญชีธนาคารในลาว (BCEL, JDB, LDB...)",
      en: "Bank transfer via major Lao banks (BCEL, JDB, LDB, etc.)",
      zh: "老挝各大商业银行转账 (BCEL, JDB, LDB 等)",
    },
    platforms: ["Web Trading (LCS Portal)", "LSX Mobile"],
    website: "http://www.lcs.com.la",
    contact: {
      phone: "+856 21 265 666",
      address: "ອາຄານຕະຫຼາດຫຼັກຊັບລາວ (LSX), ຊັ້ນ 5, ຖະໜົນກຳແພງເມືອງ, ນະຄອນຫຼວງວຽງຈັນ",
    },
  },
  {
    id: "lxs",
    name: "Lanexang Securities Public Company",
    nativeName: "ບໍລິສັດ ຫຼັກຊັບ ລ້ານຊ້າງ ມະຫາຊົນ (LXS)",
    category: "lsx",
    badge: "ພັນທະມິດ LDB",
    avatar: "LXS",
    avatarBg: "from-cyan-600 to-blue-700",
    license: "ສຳນັກງານ ຄະນະກຳມະການຄຸ້ມຄອງຫຼັກຊັບ (ສຄລ)",
    markets: ["LSX Stocks", "ພັນທະບັດລັດຖະບານ", "ກອງທຶນລວມ"],
    description: {
      lo: "ບໍລິສັດຫຼັກຊັບມະຫາຊົນທີ່ມີ ທະນາຄານພັດທະນາລາວ (LDB) ແລະ Sacombank Securities ເປັນຜູ້ຮ່ວມທຶນ. ບໍລິການນາຍໜ້າຊື້ຂາຍຫຼັກຊັບ ແລະ ຈຳໜ່າຍພັນທະບັດ.",
      th: "บริษัทหลักทรัพย์มหาชนที่มี ธนาคารพัฒนาลาว (LDB) และ Sacombank Securities ร่วมทุน ให้บริการนายหน้าซื้อขายหลักทรัพย์และตัวแทนจำหน่ายพันธบัตร",
      en: "Public securities company partnered with Lao Development Bank (LDB) and Sacombank Securities. Provides stock brokerage and government bond distribution.",
      zh: "由老挝发展银行 (LDB) 与越南 Sacombank 证券合资的大型券商。提供证券经纪与老挝政府国债代理承销服务。",
    },
    highlights: {
      lo: [
        "ເຊື່ອມຕໍ່ກັບຖານລູກຄ້າ ແລະ ບັນຊີ ທະນາຄານພັດທະນາລາວ (LDB)",
        "ບໍລິການຊື້ຂາຍພັນທະບັດລັດຖະບານ ແລະ ຫຸ້ນກູ້",
        "ມີເຈົ້າໜ້າທີ່ໃຫ້ຄຳແນະນຳການລົງທຶນຢ່າງໃກ້ຊິດ",
      ],
      th: [
        "เชื่อมโยงกับฐานลูกค้าและบัญชี ธนาคารพัฒนาลาว (LDB)",
        "บริการซื้อขายพันธบัตรรัฐบาลและหุ้นกู้",
        "มีเจ้าหน้าที่ให้คำแนะนำการลงทุนอย่างใกล้ชิด",
      ],
      en: [
        "Direct partnership with Lao Development Bank (LDB) account holders",
        "Strong government bond and corporate debt distribution network",
        "Personalized client service and local advisory desk",
      ],
      zh: [
        "与老挝发展银行 (LDB) 账户互联互通",
        "老挝政府债券与企业债券优质分销商",
        "提供专属客服与本地化投资辅导",
      ],
    },
    fees: {
      lo: "~0.44% ຂອງມູນຄ່າການຊື້ຂາຍ",
      th: "~0.44% ของมูลค่าการซื้อขาย",
      en: "~0.44% per transaction",
      zh: "约 0.44% / 笔交易",
    },
    minDeposit: {
      lo: "ບໍ່ມີຂັ້ນຕ່ຳ (0 ກີບ)",
      th: "ไม่มีขั้นต่ำ (0 กีบ)",
      en: "No minimum deposit",
      zh: "无最低入金限制",
    },
    depositMethods: {
      lo: "ໂອນຜ່ານບັນຊີ LDB Bank ຫຼື ທະນາຄານພັນທະມິດ",
      th: "โอนผ่านบัญชี LDB Bank หรือธนาคารพันธมิตร",
      en: "Transfer via LDB Bank or partner commercial banks",
      zh: "通过老挝发展银行 (LDB) 或合作商业银行转账",
    },
    platforms: ["LXS Web Trading", "LSX Mobile"],
    website: "http://www.lxs.com.la",
    contact: {
      phone: "+856 21 265 461",
      address: "ອາຄານຕະຫຼາດຫຼັກຊັບລາວ (LSX), ຊັ້ນ 6, ຖະໜົນກຳແພງເມືອງ, ນະຄອນຫຼວງວຽງຈັນ",
    },
  },
  {
    id: "ibkr",
    name: "Interactive Brokers (IBKR)",
    nativeName: "ອິນເຕີແອັກທີບ ໂບຣກເກີສ໌ (IBKR)",
    category: "global",
    badge: "ໂບຣກເກີອັນດັບ 1 ຂອງໂລກ",
    avatar: "IBKR",
    avatarBg: "from-rose-700 to-slate-900",
    license: "US SEC, FINRA, SIPC, UK FCA, MAS (Singapore)",
    markets: ["US Stocks (NYSE, NASDAQ)", "ETFs (VOO, SPY, QQQ)", "Options", "European & Asian Markets"],
    description: {
      lo: "ໂບຣກເກີມາດຕະຖານສາກົນລະດັບໂລກທີ່ໄດ້ຮັບຄວາມນິຍົມສູງສຸດ. ນັກລົງທຶນໃນລາວສາມາດສະໝັກເປີດບັນຊີໄດ້ງ່າຍຜ່ານອອນລາຍດ້ວຍ Passport, ຄ່າຄອມມິດຊັ່ນຕ່ຳທີ່ສຸດ ແລະ ຄວາມປອດໄພສູງສຸດ.",
      th: "โบรกเกอร์มาตรฐานสากลอันดับ 1 ของโลกที่ได้รับความนิยมสูงสุด นักลงทุนในลาวสามารถสมัครเปิดบัญชีออนไลน์ได้ด้วย Passport ค่าคอมมิชชั่นต่ำที่สุด และปลอดภัยสูงสุด",
      en: "The world's premier multi-asset brokerage firm. Lao citizens and residents can open accounts online using a valid Passport. Offers ultra-low commission and institutional-grade security (SIPC protection up to $500,000).",
      zh: "全球领先的顶级综合券商。老挝居民可凭有效护照直接在线申请开户。支持以极低佣金直接买卖美股、全球ETF及期权，享有最高 50 万美元的 SIPC 资金保障。",
    },
    highlights: {
      lo: [
        "ຄົນລາວສາມາດສະໝັກ ແລະ ຢືນຢັນຕົວຕົນ (KYC) ດ້ວຍ Passport ໄດ້ 100% ອອນລາຍ",
        "ຄ່າທຳນຽມຕ່ຳທີ່ສຸດ ($0.005/ຫຸ້ນ ຫຼື ປະມານ $1 ຕໍ່ຄຳສັ່ງ)",
        "ຄຸ້ມຄອງເງິນລົງທຶນໂດຍ SIPC ສູງເຖິງ $500,000 ໂດລາສະຫະລັດ",
        "ໄດ້ດອກເບ້ຍເງິນສົດ (Cash Yield) ສູງສຳລັບເງິນ USD ທີ່ເຫຼືອໃນບັນຊີ",
      ],
      th: [
        "นักลงทุนในลาวเปิดบัญชีและยืนยันตัวตน (KYC) ด้วย Passport ได้ 100% ออนไลน์",
        "ค่าธรรมเนียมต่ำที่สุดในโลก ($0.005/หุ้น หรือประมาณ $1 ต่อรายการ)",
        "คุ้มครองเงินลงทุนโดย SIPC สูงถึง $500,000 USD",
        "รับดอกเบี้ยเงินฝากสกุล USD ในพอร์ตสูงอย่างต่อเนื่อง",
      ],
      en: [
        "Lao investors can complete 100% online registration and KYC with valid Passport",
        "Industry-lowest commissions (~$0.005 per share or min $1/order)",
        "SIPC account protection up to $500,000 for securities & cash",
        "High interest yield on uninvested idle USD cash balances",
      ],
      zh: [
        "老挝居民凭个人护照即可 100% 在线完成 KYC 身份认证与开户",
        "极低的行业佣金费率（每股仅 0.005 美元或单笔低至 1 美元）",
        "受美国 SIPC 投资保障协会最高 50 万美元赔付保护",
        "账户闲置美元现金可享具有竞争力的年化利息收益",
      ],
    },
    fees: {
      lo: "ເລີ່ມຕົ້ນ $0.005 ຕໍ່ຫຸ້ນ (ຂັ້ນຕ່ຳ ~$1 ຕໍ່ຄຳສັ່ງ)",
      th: "เริ่มต้น $0.005 ต่อหุ้น (ขั้นต่ำ ~$1 ต่อคำสั่งซื้อขาย)",
      en: "From $0.005 / share (min ~$1 / order)",
      zh: "低至 $0.005/股 (单笔订单最低仅需约 $1)",
    },
    minDeposit: {
      lo: "$0 (ບໍ່ມີຂັ້ນຕ່ຳ)",
      th: "$0 (ไม่มีขั้นต่ำ)",
      en: "$0 (No minimum deposit)",
      zh: "$0 (无最低开户金额限制)",
    },
    depositMethods: {
      lo: "ໂອນສາກົນ SWIFT Wire Transfer ຫຼື ຜ່ານ Wise (Multi-Currency Account)",
      th: "โอนเงินข้ามประเทศ SWIFT Wire Transfer หรือผ่าน Wise",
      en: "International SWIFT Bank Wire or Wise Multi-Currency Account",
      zh: "国际电汇 (SWIFT Wire Transfer) 或通过 Wise 多币种账户充值",
    },
    platforms: ["IBKR GlobalTrader", "IBKR Mobile (iOS/Android)", "Trader Workstation (TWS)", "Client Portal Web"],
    website: "https://www.interactivebrokers.com",
    referralUrl: "https://ibkr.com/referral/bounpheng720",
    referralCode: "bounpheng720",
    referralBonus: {
      lo: "🎁 ຮັບຮຸ້ນ IBKR ຟຣີສູງເຖິງ $1,000 USD ເມື່ອເປີດບັນຊີຜ່ານລິ້ງແນະນຳນີ້",
      th: "🎁 รับหุ้น IBKR ฟรีมูลค่าสูงสุด $1,000 USD เมื่อเปิดบัญชีผ่านลิงก์นี้",
      en: "🎁 Earn up to $1,000 USD in free IBKR shares when opening an account via this link",
      zh: "🎁 通过此专属邀请链接开户入金即可获赠最高价值 $1,000 美元的 IBKR 股票奖励",
    },
  },
  {
    id: "etoro",
    name: "eToro Social Trading",
    nativeName: "ອີໂທໂຣ (eToro)",
    category: "global",
    badge: "CopyTrader & ມືໃໝ່",
    avatar: "eToro",
    avatarBg: "from-emerald-600 to-teal-800",
    license: "UK FCA, ASIC (Australia), CySEC",
    markets: ["US Stocks", "Fractional Shares (ຫຸ້ນເສດສ່ວນ)", "ETFs", "Commodities (Gold, Oil)"],
    description: {
      lo: "ແພລັດຟອມ Social Trading ອັນດັບ 1 ຂອງໂລກ ທີ່ເໝາະສຳລັບຜູ້ເລີ່ມຕົ້ນ. ໂດດເດັ່ນດ້ວຍຟັງຊັ່ນ CopyTrader ທີ່ສາມາດກົດຄັດລອກການເທຣດຂອງນັກລົງທຶນມືອາຊີບໄດ້ແບບອັດຕະໂນມັດ.",
      th: "แพลตฟอร์ม Social Trading อันดับ 1 ของโลก เหมาะสำหรับมือใหม่ โดดเด่นด้วยฟังก์ชัน CopyTrader ที่สามารถกดคัดลอกพอร์ตของเทรดเดอร์มือโปรได้อัตโนมัติ",
      en: "The world's leading social investment network, ideal for beginners. Features CopyTrader™ technology allowing you to automatically mirror the moves of top-performing investors.",
      zh: "全球领先的社交投资平台，极度适合新手。独创的 CopyTrader™ 复制跟单系统让您可以一键自动同步全球顶尖明星交易员的持仓组合。",
    },
    highlights: {
      lo: [
        "ລະບົບ CopyTrader: ກັອບປີ້ການລົງທຶນຂອງນັກເທຣດມືອາຊີບໄດ້ໂດຍອັດຕະໂນມັດ",
        "ຊື້ຫຸ້ນເສດສ່ວນ (Fractional Shares) ໄດ້ ເລີ່ມຕົ້ນພຽງ $10 ເທົ່ານັ້ນ",
        "ໜ້າຕາແອັບ (UI) ສວຍງາມ, ເຂົ້າໃຈງ່າຍ, ເໝາະສຳລັບຜູ້ເລີ່ມຕົ້ນໃໝ່",
        "ມີບັນຊີທົດລອງ (Virtual Portfolio $100k) ໃຫ້ຝຶກເທຣດຟຣີ",
      ],
      th: [
        "ระบบ CopyTrader: คัดลอกการลงทุนของเทรดเดอร์ชั้นนำได้อัตโนมัติ",
        "ซื้อหุ้นเศษส่วน (Fractional Shares) เริ่มต้นเพียง $10",
        "หน้าตาแอปสวยงาม ใช้งานง่ายมาก เหมาะกับมือใหม่อย่างยิ่ง",
        "มีพอร์ตจำลอง (Virtual $100k) ให้ฝึกซ้อมเทรดฟรีโดยไม่มีความเสี่ยง",
      ],
      en: [
        "CopyTrader™ feature: Automatically replicate trades of top-ranked global investors",
        "Fractional share investing: Buy pieces of expensive stocks (like Apple, Tesla) from just $10",
        "Clean, intuitive and beginner-friendly user interface on web & mobile",
        "Free $100,000 Virtual Demo Portfolio to practice trading risk-free",
      ],
      zh: [
        "CopyTrader 跟单系统：自动复制全球排名居前的顶尖投资高手交易策略",
        "碎股微型投资：购买苹果、英伟达等高价股票仅需 10 美元起步",
        "界面极简友好，非常适合零基础初学者上手",
        "提供 10 万美元虚拟演练账户，随时免费模拟实盘操作",
      ],
    },
    fees: {
      lo: "0% Commission ສຳລັບຫຸ້ນສະຫະລັດ (ມີຄ່າ Spread ແລະ ຖອນເງິນ $5)",
      th: "0% Commission สำหรับหุ้นสหรัฐฯ (มีค่า Spread และค่าธรรมเนียมถอน $5)",
      en: "0% Commission on US stocks (spreads apply, $5 withdrawal fee)",
      zh: "美股 0% 买卖佣金（包含点差，提现每笔仅收 $5）",
    },
    minDeposit: {
      lo: "$50 - $100 ໂດລາ",
      th: "$50 - $100 ดอลลาร์",
      en: "$50 - $100 USD",
      zh: "$50 - $100 美元",
    },
    depositMethods: {
      lo: "ບັດ Visa/Mastercard, ໂອນທະນາຄານສາກົນ, ຫຼື e-Wallets",
      th: "บัตร Visa/Mastercard, โอนเงินผ่านธนาคาร, หรือ e-Wallets",
      en: "Credit/Debit Card (Visa/Mastercard), Bank Wire, or e-Wallets",
      zh: "信用卡/借记卡 (Visa/Mastercard)、银行电汇或国际电子钱包",
    },
    platforms: ["eToro App (iOS/Android)", "eToro Web Platform"],
    website: "https://www.etoro.com",
  },
  {
    id: "binance",
    name: "Binance Global",
    nativeName: "ໄບແນນສ໌ (Binance)",
    category: "crypto",
    badge: "Crypto ອັນດັບ 1 ຂອງໂລກ",
    avatar: "Binance",
    avatarBg: "from-amber-500 to-yellow-600",
    license: "VASP / FIU Regulated globally (France, Dubai, Italy, Japan...)",
    markets: ["Bitcoin (BTC)", "Ethereum (ETH)", "USDT", "350+ Crypto Assets", "P2P Market (LAK)"],
    description: {
      lo: "ກະດານເທຣດສິນຊັບດິຈິທອນ (Cryptocurrency) ອັນດັບ 1 ຂອງໂລກ. ມີລະບົບ P2P ທີ່ຮອງຮັບການຊື້-ຂາຍ USDT ດ້ວຍເງິນກີບ (LAK) ຜ່ານແອັບ BCEL One ໂດຍກົງ ແລະ ສະດວກທີ່ສຸດ.",
      th: "กระดานเทรดสินทรัพย์ดิจิทัลอันดับ 1 ของโลก มีระบบ P2P รองรับการซื้อขาย USDT ด้วยเงินกีบ (LAK) ผ่านแอป BCEL One โดยตรงอย่างสะดวกรวดเร็ว",
      en: "The world's largest cryptocurrency exchange by trading volume. Features a thriving P2P marketplace supporting direct Lao Kip (LAK) transactions via BCEL One.",
      zh: "全球交易量第一大的数字资产交易平台。拥有活跃的 P2P C2C 场外交易市场，支持直接使用老挝基普 (LAK) 通过 BCEL One 手机银行即时快捷买卖 USDT。",
    },
    highlights: {
      lo: [
        "ມີລະບົບ P2P ຊື້-ຂາຍ USDT ດ້ວຍເງິນກີບ (LAK) ໂອນຜ່ານ BCEL One ສະດວກ ແລະ ໄວ",
        "ສະພາບຄ່ອງສູງສຸດໃນໂລກ, ຄ່າທຳນຽມຊື້ຂາຍຕ່ຳຫຼາຍ (ພຽງ 0.1% ຫຼື ຕ່ຳກວ່າ)",
        "ກອງທຶນປົກປ້ອງຊັບສິນ SAFU Fund ມູນຄ່າຫຼາຍກວ່າ 1 ຕື້ໂດລາ",
        "ມີລະບົບ Binance Earn ສາມາດຝາກຫຼຽນຮັບດອກເບ້ຍ (Passive Income) ໄດ້",
      ],
      th: [
        "มีระบบ P2P ซื้อ-ขาย USDT ด้วยเงินกีบ (LAK) ผ่าน BCEL One รวดเร็วและสะดวก",
        "สภาพคล่องสูงสุดในโลก ค่าธรรมเนียมต่ำมาก (เพียง 0.1% หรือต่ำกว่า)",
        "กองทุนคุ้มครองผู้ใช้งาน SAFU มูลค่ามากกว่า 1,000 ล้านดอลลาร์",
        "ฟีเจอร์ Binance Earn สามารถออมเหรียญรับดอกเบี้ยผลตอบแทนได้",
      ],
      en: [
        "P2P marketplace allows direct buy/sell of USDT using Lao Kip (LAK) via BCEL One",
        "Highest liquidity globally with ultra-low trading fees (from 0.1% or lower with BNB)",
        "SAFU Emergency Fund protecting user assets valued at over $1 Billion",
        "Binance Earn: Earn passive yield on stablecoins and crypto holdings",
      ],
      zh: [
        "支持 P2P 快捷买卖 USDT，可通过 BCEL One 等老挝本地银行直接转账老挝基普结算",
        "全球第一的交易深度与流动性，基础现货手续费仅 0.1%（持有BNB更享折扣）",
        "拥有超 10 亿美元规模的 SAFU 投资者应急资产保障基金",
        "Binance 理财支持活期定期存币赚息，获取稳健被动收益",
      ],
    },
    fees: {
      lo: "0.1% (ຫຼຸດ 25% ຖ້າຈ່າຍດ້ວຍ BNB) · P2P ຟຣີຄ່າທຳນຽມສຳລັບຜູ້ຊື້",
      th: "0.1% (ลด 25% หากใช้ BNB) · P2P ฟรีค่าธรรมเนียมสำหรับผู้ซื้อ",
      en: "0.1% spot fee (25% off with BNB) · 0% fee on P2P taker orders",
      zh: "现货 0.1%（BNB抵扣立享75折）· P2P 普通买入 0 手续费",
    },
    minDeposit: {
      lo: "$10 (ປະມານ 220,000 ກີບ ຜ່ານ P2P)",
      th: "$10 (ประมาณ 350 บาท หรือซื้อผ่าน P2P)",
      en: "$10 (or equivalent via P2P)",
      zh: "$10 美元（或在 P2P 市场小额买入）",
    },
    depositMethods: {
      lo: "Binance P2P (ໂອນເງິນກີບຜ່ານ BCEL One / ທະນາຄານລາວ) ຫຼື ໂອນ Crypto",
      th: "Binance P2P (โอนเงินผ่าน BCEL One / บัญชีธนาคารลาว) หรือฝากเหรียญ Crypto",
      en: "Binance P2P (Direct LAK transfer via BCEL One) or Crypto transfer",
      zh: "Binance P2P C2C 专区 (支持 BCEL One 基普手机银行转账) 或链上充币",
    },
    platforms: ["Binance App (iOS/Android)", "Binance Web", "Desktop App"],
    website: "https://www.binance.com",
    referralUrl: "https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=en&ref=GRO_28502_IZJD7&utm_source=referral_entrance",
    referralCode: "GRO_28502_IZJD7",
    referralBonus: {
      lo: "🎁 ຮັບໂບນັດຮ່ວມກັນ (Refer2Earn USDC) ເມື່ອສະໝັກຜ່ານລິ້ງແນະນຳນີ້",
      th: "🎁 รับโบนัสพิเศษ (Refer2Earn USDC) เมื่อลงทะเบียนผ่านลิงก์นี้",
      en: "🎁 Earn USDC welcome rewards together when registering via this referral link",
      zh: "🎁 通过此专属邀请链接注册即可共享 USDC 迎新奖励",
    },
  },
];

const LSX_STEPS = [
  {
    step: 1,
    title: {
      lo: "1. ເປີດແອັບ BCEL One",
      th: "1. เปิดแอป BCEL One",
      en: "1. Open BCEL One App",
      zh: "1. 打开 BCEL One 手机银行",
    },
    desc: {
      lo: "ເຂົ້າສູ່ລະບົບ BCEL One ໃນມືຖືຂອງທ່ານ ➔ ເຂົ້າເມນູ 'ການບໍລິການທັງໝົດ' ➔ ຊອກຫາໄອຄອນ 'ຫຼັກຊັບ (Securities)'.",
      th: "เข้าสู่ระบบ BCEL One บนมือถือ ➔ ไปที่ 'บริการทั้งหมด' ➔ เลือกไอคอน 'หลักทรัพย์ (Securities)'",
      en: "Log into your BCEL One app ➔ Navigate to 'All Services' ➔ Tap on the 'Securities' icon.",
      zh: "登录手机上的 BCEL One App ➔ 进入全部服务 ➔ 找到并点击'证券服务 (Securities)'。",
    },
    icon: Smartphone,
  },
  {
    step: 2,
    title: {
      lo: "2. ເລືອກເປີດບັນຊີກັບ BCEL-KT",
      th: "2. เลือกเปิดบัญชีกับ BCEL-KT",
      en: "2. Select BCEL-KT Broker",
      zh: "2. 选择申请 BCEL-KT 证券账户",
    },
    desc: {
      lo: "ເລືອກ 'ເປີດບັນຊີຊື້ຂາຍຫຸ້ນ' (Open Trading Account) ກັບ ບໍລິສັດ ຫຼັກຊັບ ທຄຕລ-KT ຈຳກັດ.",
      th: "เลือก 'เปิดบัญชีซื้อขายหลักทรัพย์' กับ บริษัทหลักทรัพย์ บีซีอีแอล-เคที จำกัด",
      en: "Choose 'Open Trading Account' with BCEL-KT Securities Co., Ltd.",
      zh: "选择向老挝外贸银行旗下的 BCEL-KT 证券公司提交证券交易账户开户申请。",
    },
    icon: Building2,
  },
  {
    step: 3,
    title: {
      lo: "3. ກວດສອບຂໍ້ມູນ & ຢືນຢັນ",
      th: "3. ตรวจสอบข้อมูล & ยืนยัน",
      en: "3. Verify Profile & Confirm",
      zh: "3. 核对个人资料并提交认证",
    },
    desc: {
      lo: "ລະບົບຈະດຶງຂໍ້ມູນບັດປະຈຳຕົວ ແລະ ບັນຊີເງິນຝາກຈາກ BCEL One ຂອງທ່ານ ➔ ກວດສອບຄວາມຖືກຕ້ອງ ແລະ ກົດຢືນຢັນ OTP.",
      th: "ระบบจะดึงข้อมูลบัตรประชาชนและบัญชีจาก BCEL One ของคุณโดยอัตโนมัติ ➔ ตรวจสอบความถูกต้องและกดยืนยันด้วย OTP",
      en: "The system auto-fills your verified personal details and linked bank account from BCEL One ➔ Review and confirm via OTP.",
      zh: "系统将自动提取绑定在 BCEL One 的身份及银行信息 ➔ 确认信息无误后输入 OTP 动态验证码完成签署。",
    },
    icon: CheckCircle2,
  },
  {
    step: 4,
    title: {
      lo: "4. ອະນຸມັດ & ເລີ່ມຕົ້ນເທຣດ",
      th: "4. อนุมัติ & เริ่มต้นเทรด",
      en: "4. Approved & Start Trading",
      zh: "4. 快速审核通过即可入金交易",
    },
    desc: {
      lo: "ພາຍໃນ 1-2 ວັນລັດຖະການ ທ່ານຈະໄດ້ຮັບລະຫັດນັກລົງທຶນ (Investor Code) ➔ ໂອນເງິນເຂົ້າພອດເທຣດຜ່ານ BCEL One ແລ້ວເລີ່ມຊື້ຫຸ້ນໄດ້ທັນທີ!",
      th: "ภายใน 1-2 วันทำการ ท่านจะได้รับรหัสนักลงทุน (Investor Code) ➔ โอนเงินเข้าพอร์ตผ่าน BCEL One และเริ่มซื้อขายหุ้นได้ทันที!",
      en: "Within 1-2 business days you will receive your official Investor Code ➔ Transfer funds into trading portfolio via BCEL One and start investing!",
      zh: "通常在 1-2 个工作日内即可完成审批并获得投资者编号 ➔ 在 BCEL One 划转资金至证券户即可实时买入老挝股票！",
    },
    icon: Sparkles,
  },
];

export default function BrokersGuide() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "lsx" | "global" | "crypto">("all");
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // Fallback
    }
  };

  const filteredBrokers = BROKERS_DATA.filter((b) => {
    const matchCategory = activeTab === "all" || b.category === activeTab;
    const q = search.toLowerCase().trim();
    if (!q) return matchCategory;

    const nameMatch = b.name.toLowerCase().includes(q) || b.nativeName.toLowerCase().includes(q);
    const descMatch = (b.description[language] || b.description.en).toLowerCase().includes(q);
    const marketsMatch = b.markets.some((m) => m.toLowerCase().includes(q));

    return matchCategory && (nameMatch || descMatch || marketsMatch);
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-800 text-white p-6 sm:p-10 shadow-xl shadow-blue-900/15">
        {/* Decorative ambient elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold tracking-wide">
            <ShieldCheck size={16} className="text-emerald-300" />
            <span>{t("brokers.badge")}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t("brokers.title")}
          </h1>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl font-normal">
            {t("brokers.subtitle")}
          </p>

          {/* Quick stats pills */}
          <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-4 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
              <span className="text-base">🇱🇦</span>
              <span>3 ບໍລິສັດຫຼັກຊັບ ສະມາຊິກ LSX</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
              <span className="text-base">🌍</span>
              <span>ໂບຣກເກີມາດຕະຖານສາກົນ (SIPC / FCA)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
              <span className="text-base">📱</span>
              <span>ເປີດບັນຊີງ່າຍຜ່ານ BCEL One</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 bg-slate-100 dark:bg-surface-card rounded-xl border border-sky-200/80 dark:border-surface-border">
          <button
            onClick={() => setActiveTab("all")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === "all"
                ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {t("brokers.tabAll")} ({BROKERS_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab("lsx")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === "lsx"
                ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {t("brokers.tabLsx")}
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === "global"
                ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {t("brokers.tabGlobal")}
          </button>
          <button
            onClick={() => setActiveTab("crypto")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === "crypto"
                ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {t("brokers.tabCrypto")}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t("brokers.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-surface-card border border-sky-200/80 dark:border-surface-border text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Broker Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBrokers.map((broker) => {
          const desc = broker.description[language] || broker.description.en;
          const highlights = broker.highlights[language] || broker.highlights.en;
          const fees = broker.fees[language] || broker.fees.en;
          const minDep = broker.minDeposit[language] || broker.minDeposit.en;
          const deposit = broker.depositMethods[language] || broker.depositMethods.en;

          return (
            <div
              key={broker.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-surface-card border border-sky-200/80 dark:border-surface-border p-6 shadow-xs hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-200"
            >
              <div>
                {/* Top Row: Avatar & Badges */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-xl bg-gradient-to-tr flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0",
                        broker.avatarBg
                      )}
                    >
                      {broker.avatar.length <= 4 ? broker.avatar : broker.avatar.substring(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                        {broker.nativeName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                        {broker.name}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-blue-900/60 shrink-0">
                    {broker.badge}
                  </span>
                </div>

                {/* Regulation / License Banner */}
                <div className="flex items-center gap-2 mb-3.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <ShieldCheck size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">{broker.license}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed mb-4">
                  {desc}
                </p>

                {/* Market Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {broker.markets.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-surface-hover text-slate-700 dark:text-gray-300 border border-slate-200/60 dark:border-surface-border/60"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Key Highlights */}
                <div className="space-y-2 mb-5 p-3.5 rounded-xl bg-slate-50/80 dark:bg-surface/50 border border-sky-100 dark:border-surface-border/40">
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {t("brokers.highlights")}
                  </span>
                  {highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-gray-300">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Info Grid: Fees, Min Deposit, Deposit Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="p-2.5 rounded-lg bg-sky-50/50 dark:bg-blue-950/20 border border-sky-150 dark:border-blue-900/30">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400 font-medium mb-0.5">
                      <Percent size={13} className="text-blue-500" />
                      <span>{t("brokers.fees")}</span>
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-gray-200">{fees}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-sky-50/50 dark:bg-blue-950/20 border border-sky-150 dark:border-blue-900/30">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400 font-medium mb-0.5">
                      <CreditCard size={13} className="text-blue-500" />
                      <span>{t("brokers.minDeposit")}</span>
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-gray-200">{minDep}</div>
                  </div>
                </div>

                {/* Deposit Method & Platforms */}
                <div className="space-y-2 mb-5 text-xs text-slate-600 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <Coins size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-gray-200">{t("brokers.depositMethod")}: </span>
                      <span>{deposit}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Smartphone size={14} className="text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-gray-200">{t("brokers.platforms")}: </span>
                      <span>{broker.platforms.join(" · ")}</span>
                    </div>
                  </div>

                  {broker.contact && (
                    <div className="pt-2 border-t border-sky-100 dark:border-surface-border/50 space-y-1 text-slate-500 dark:text-gray-400">
                      {broker.contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={13} />
                          <span>{broker.contact.phone}</span>
                        </div>
                      )}
                      {broker.contact.address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={13} className="shrink-0 mt-0.5" />
                          <span>{broker.contact.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Referral Bonus Banner (if available) */}
              {broker.referralBonus && (
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 dark:border-yellow-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
                    <Gift size={16} className="text-amber-500 shrink-0" />
                    <span>{broker.referralBonus[language] || broker.referralBonus.en}</span>
                  </div>
                  {broker.referralCode && (
                    <button
                      type="button"
                      onClick={() => handleCopyCode(broker.referralCode!)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold transition-colors shrink-0 self-start sm:self-auto cursor-pointer border border-amber-500/30"
                      title="Copy Referral Code"
                    >
                      <span>Ref: {broker.referralCode}</span>
                      {copiedCode === broker.referralCode ? (
                        <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy size={13} className="text-amber-700 dark:text-amber-300" />
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-sky-150 dark:border-surface-border flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {broker.referralUrl ? (
                  <>
                    <a
                      href={broker.referralUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.01]",
                        broker.id === "binance"
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-extrabold shadow-amber-500/20"
                          : broker.id === "ibkr"
                          ? "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold shadow-red-600/20"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                      )}
                    >
                      <Sparkles size={16} className={broker.id === "binance" ? "text-slate-950" : "text-yellow-300"} />
                      <span>
                        {language === "lo"
                          ? "ສະໝັກເປີດບັນຊີ (ຮັບໂບນັດ)"
                          : language === "th"
                          ? "สมัครเปิดบัญชี (รับโบนัส)"
                          : language === "zh"
                          ? "立即注册开户 (享迎新礼)"
                          : "Sign Up (Claim Bonus)"}
                      </span>
                      <ExternalLink size={14} />
                    </a>

                    <a
                      href={broker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-surface-hover dark:hover:bg-surface-border text-slate-700 dark:text-gray-300 font-semibold text-xs transition-colors shrink-0"
                    >
                      <span>{t("brokers.visitWebsite")}</span>
                      <ExternalLink size={13} />
                    </a>
                  </>
                ) : (
                  <a
                    href={broker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all hover:scale-[1.01]"
                  >
                    <span>{t("brokers.visitWebsite")}</span>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step-by-Step Guide for LSX via BCEL One */}
      <div className="rounded-2xl bg-white dark:bg-surface-card border border-sky-200/80 dark:border-surface-border p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Smartphone size={14} />
            <span>BCEL One Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t("brokers.guideTitle")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">
            {t("brokers.guideSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {LSX_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const title = step.title[language] || step.title.en;
            const desc = step.desc[language] || step.desc.en;

            return (
              <div
                key={step.step}
                className="relative flex flex-col p-5 rounded-xl bg-slate-50 dark:bg-surface border border-sky-150 dark:border-surface-border/60 hover:shadow-md transition-shadow group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documents Needed & Anti-Scam Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Documents Checklist (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-surface-card border border-sky-200/80 dark:border-surface-border p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <FileText size={20} className="text-blue-600 dark:text-sky-400" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {t("brokers.docsTitle")}
            </h3>
          </div>

          <div className="space-y-3.5 text-sm text-slate-700 dark:text-gray-300">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/50 dark:bg-surface/50 border border-sky-100 dark:border-surface-border/40">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">ບັດປະຈຳຕົວ ຫຼື Passport</span>
                <span className="text-xs text-slate-500 dark:text-gray-400">ສຳເນົາບັດປະຈຳຕົວປະຊາຊົນລາວ ຫຼື ໜັງສືຜ່ານແດນທີ່ຍັງບໍ່ໝົດອາຍຸ</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/50 dark:bg-surface/50 border border-sky-100 dark:border-surface-border/40">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">ສຳມະໂນຄົວ ຫຼື ໃບຢັ້ງຢືນທີ່ຢູ່</span>
                <span className="text-xs text-slate-500 dark:text-gray-400">ສຳລັບຢືນຢັນຖິ່ນຖານທີ່ຢູ່ອາໄສໃນ ສປປ ລາວ</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/50 dark:bg-surface/50 border border-sky-100 dark:border-surface-border/40">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">ບັນຊີທະນາຄານ (BCEL, LDB, JDB...)</span>
                <span className="text-xs text-slate-500 dark:text-gray-400">ສຳລັບຜູກບັນຊີຮັບເງິນປັນຜົນ (Dividend) ແລະ ຝາກ-ຖອນເງິນ</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/50 dark:bg-surface/50 border border-sky-100 dark:border-surface-border/40">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">ເບີໂທລະສັບ & Email ທີ່ໃຊ້ງານຈິງ</span>
                <span className="text-xs text-slate-500 dark:text-gray-400">ເພື່ອຮັບລະຫັດ OTP ແລະ ໃບຢັ້ງຢືນການຊື້ຂາຍຫຼັກຊັບ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Anti-Scam Advisory (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 text-amber-800 dark:text-amber-300">
            <AlertTriangle size={22} className="text-amber-600 dark:text-amber-400" />
            <h3 className="font-extrabold text-lg">
              {t("brokers.safetyTitle")}
            </h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-900/40">
              <strong className="text-amber-900 dark:text-amber-300 block mb-1">
                ⚠️ 1. ບໍ່ມີການຮັບປະກັນຜົນຕອບແທນ 100%:
              </strong>
              <span>
                ຕະຫຼາດຫຼັກຊັບລາວ (LSX) ແລະ ບໍລິສັດຫຼັກຊັບທີ່ຖືກຕ້ອງຕາມກົດໝາຍ **ຈະບໍ່ມີວັນຮັບປະກັນຜົນຕອບແທນຕາຍໂຕ** (ເຊັ່ນ: ການັນຕີກຳໄລມື້ລະ 5-10%). ຖ້າພົບເຫັນການໂຄສະນາແບບນີ້ ແມ່ນກຸ່ມຫຼອກລວງ (Scam) 100%.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-900/40">
              <strong className="text-amber-900 dark:text-amber-300 block mb-1">
                ⚠️ 2. ຫ້າມໂອນເງິນເຂົ້າບັນຊີສ່ວນບຸກຄົນ:
              </strong>
              <span>
                ການເປີດພອດ ແລະ ຝາກເງິນລົງທຶນ ຈະຕ້ອງໂອນເຂົ້າບັນຊີທາງການຂອງ "ບໍລິສັດຫຼັກຊັບ" ໂດຍກົງ ຫຼື ຕັດຜ່ານລະບົບທະນາຄານ (ເຊັ່ນ BCEL One) ເທົ່ານັ້ນ. ຫ້າມໂອນເງິນເຂົ້າບັນຊີຊື່ບຸກຄົນ ຫຼື ຕົວແທນໃດໆເດັດຂາດ.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-900/40">
              <strong className="text-amber-900 dark:text-amber-300 block mb-1">
                ⚠️ 3. ລະວັງການແອບອ້າງຊື່ບໍລິສັດໃນກຸ່ມ Facebook / Telegram:
              </strong>
              <span>
                ປັດຈຸບັນມີມິດສາຊີບສ້າງກຸ່ມ Telegram ຫຼື ເພຈ Facebook ປອມ ໂດຍໃຊ້ໂລໂກ້ຂອງ BCEL-KT ຫຼື LSX ເພື່ອຊວນລົງທຶນ. ຄວນຕິດຕໍ່ຜ່ານເບີໂທ ແລະ ເວັບໄຊທາງການທີ່ໄດ້ຮັບການຢືນຢັນເທົ່ານັ້ນ.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
