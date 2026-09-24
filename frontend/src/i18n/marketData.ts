import { Language } from "./translations";

export interface CompanyInfo {
  name: Record<Language, string>;
  sectorKey: string;
}

export interface SectorInfo {
  key: string;
  label: Record<Language, string>;
}

// ─────────────────────────────────────────────────────────
// Sectors Dictionary (Comprehensive for all markets)
// ─────────────────────────────────────────────────────────
export const SECTORS: Record<string, Record<Language, string>> = {
  // Common / Thai / VN / CN / JP / US
  energy_utilities: {
    lo: "ພະລັງງານ & ສາທາລະນູປະໂພກ",
    th: "พลังงาน & สาธารณูปโภค",
    en: "Energy & Utilities",
    zh: "能源与公用事业",
  },
  transport_logistics: {
    lo: "ຂົນສົ່ງ & ໂລຈິສຕິກສ໌",
    th: "ขนส่ง & โลจิสติกส์",
    en: "Transportation & Logistics",
    zh: "交通运输与物流",
  },
  commerce_retail: {
    lo: "ການຄ້າ & ຄ້າປີກ",
    th: "พาณิชย์ & ค้าปลีก",
    en: "Commerce & Retail",
    zh: "商业零售与超市",
  },
  electronics: {
    lo: "ຊິ້ນສ່ວນເອເລັກໂຕຣນິກ",
    th: "ชิ้นส่วนอิเล็กทรอนิกส์",
    en: "Electronic Components",
    zh: "电子元件与精密制造",
  },
  healthcare: {
    lo: "ການແພດ & ໂຮງໝໍ",
    th: "การแพทย์ & โรงพยาบาล",
    en: "Healthcare & Hospitals",
    zh: "医疗健康与医院",
  },
  power_energy: {
    lo: "ພະລັງງານໄຟຟ້າ",
    th: "พลังงานไฟฟ้า",
    en: "Power & Electricity",
    zh: "电力与清洁能源",
  },
  tech_telecom: {
    lo: "ເຕັກໂນໂລຢີ & ໂທລະຄົມ",
    th: "เทคโนโลยี & โทรคมนาคม",
    en: "Technology & Telecom",
    zh: "信息科技与电信运营",
  },
  banking_finance: {
    lo: "ການເງິນ & ທະນາຄານ",
    th: "การเงิน & ธนาคาร",
    en: "Banking & Finance",
    zh: "银行与金融服务",
  },
  construction: {
    lo: "ວັດສະດຸກໍ່ສ້າງ",
    th: "วัสดุก่อสร้าง",
    en: "Construction Materials",
    zh: "基础建材与水泥",
  },
  oil_gas: {
    lo: "ພະລັງງານ & ນ້ຳມັນ",
    th: "พลังงาน & น้ำมัน",
    en: "Oil, Gas & Energy",
    zh: "石油与天然气开发",
  },
  property_realestate: {
    lo: "ອະສັງຫາລິມະຊັບ",
    th: "อสังหาริมทรัพย์",
    en: "Property & Real Estate",
    zh: "商业与住宅地产",
  },
  hospitality_food: {
    lo: "ໂຮງແຮມ & ອາຫານ",
    th: "โรงแรม & อาหาร",
    en: "Hotels & Food Services",
    zh: "酒店与餐饮连锁",
  },
  energy_coal: {
    lo: "ພະລັງງານ & ຖ່ານຫີນ",
    th: "พลังงาน & ถ่านหิน",
    en: "Energy & Coal",
    zh: "煤炭与传统能源",
  },
  industrial_estate: {
    lo: "ນິຄົມອຸດສາຫະກຳ",
    th: "นิคมอุตสาหกรรม",
    en: "Industrial Estates",
    zh: "工业园区开发",
  },

  // Vietnam specific
  food_beverage: {
    lo: "ອາຫານ & ເຄື່ອງດື່ມ",
    th: "อาหาร & เครื่องดื่ม",
    en: "Food & Beverage",
    zh: "食品与饮品制造",
  },
  realestate_conglomerate: {
    lo: "ອະສັງຫາລິມະຊັບ & ກຸ່ມທຸລະກິດ",
    th: "อสังหาริมทรัพย์ & กลุ่มธุรกิจ",
    en: "Real Estate & Conglomerates",
    zh: "多元化地产控股集团",
  },
  industrial_steel: {
    lo: "ອຸດສາຫະກຳ & ເຫຼັກກ້າ",
    th: "อุตสาหกรรม & เหล็กกล้า",
    en: "Industrial & Steel",
    zh: "重工业与钢铁冶炼",
  },
  tech_software: {
    lo: "ເຕັກໂນໂລຢີ & ຊອບແວ",
    th: "เทคโนโลยี & ซอฟต์แวร์",
    en: "Tech & Software",
    zh: "软件与信息技术",
  },
  consumer_retail: {
    lo: "ສິນຄ້າບໍລິໂພກ & ຄ້າປີກ",
    th: "สินค้าอุปโภค & ค้าปลีก",
    en: "Consumer Goods & Retail",
    zh: "大众消费与零售网络",
  },
  securities_finance: {
    lo: "ຫຼັກຊັບ & ການເງິນ",
    th: "หลักทรัพย์ & การเงิน",
    en: "Securities & Financial",
    zh: "证券经纪与投资银行",
  },
  realestate_malls: {
    lo: "ອະສັງຫາລິມະຊັບ & ສູນການຄ້າ",
    th: "อสังหาริมทรัพย์ & ศูนย์การค้า",
    en: "Commercial Real Estate",
    zh: "商业综合体与购物中心",
  },
  insurance_finance: {
    lo: "ປະກັນໄພ & ການເງິນ",
    th: "ประกันภัย & การเงิน",
    en: "Insurance & Finance",
    zh: "保险与综合金融",
  },
  transport_aviation: {
    lo: "ຂົນສົ່ງ & ການບິນ",
    th: "ขนส่ง & การบิน",
    en: "Aviation & Logistics",
    zh: "民航客运与航空物流",
  },
  etf_index: {
    lo: "ກອງທຶນດັດຊະນີ (ETF)",
    th: "กองทุนดัชนี (ETF)",
    en: "Index ETF",
    zh: "指数型基金 (ETF)",
  },

  // China specific
  consumer_beverages: {
    lo: "ສິນຄ້າບໍລິໂພກ & ເຄື່ອງດື່ມ",
    th: "สินค้าอุปโภค & เครื่องดื่ม",
    en: "Consumer & Beverages",
    zh: "优质白酒与消费品",
  },
  ev_battery: {
    lo: "ຍານຍົນໄຟຟ້າ & ແບັດເຕີຣີ",
    th: "ยานยนต์ไฟฟ้า & แบตเตอรี่",
    en: "EV & Batteries",
    zh: "新能源车与动力电池",
  },
  cleanenergy_battery: {
    lo: "ພະລັງງານສະອາດ & ແບັດເຕີຣີ",
    th: "พลังงานสะอาด & แบตเตอรี่",
    en: "Clean Energy & Batteries",
    zh: "绿色储能与动力电池",
  },
  appliances_electronics: {
    lo: "ເຄື່ອງໃຊ້ໄຟຟ້າ & ອຸປະກອນ",
    th: "เครื่องใช้ไฟฟ้า & อุปกรณ์",
    en: "Home Appliances & Tech",
    zh: "智能家电与高端装备",
  },
  ecommerce_cloud: {
    lo: "ອີຄອມເມິຣ໌ຊ & ຄລາວ",
    th: "อีคอมเมิร์ซ & คลาวด์",
    en: "E-Commerce & Cloud",
    zh: "电子商务与云计算",
  },
  ecommerce: {
    lo: "ອີຄອມເມິຣ໌ຊ",
    th: "อีคอมเมิร์ซ",
    en: "E-Commerce",
    zh: "跨境电商与移动消费",
  },
  gaming_tech: {
    lo: "ເກມ & ເຕັກໂນໂລຢີ",
    th: "เกม & เทคโนโลยี",
    en: "Gaming & Social Tech",
    zh: "互联网游戏与数字科技",
  },
  utilities_power: {
    lo: "ສາທາລະນູປະໂພກ & ໄຟຟ້າ",
    th: "สาธารณูปโภค & ไฟฟ้า",
    en: "Utilities & Hydro Power",
    zh: "水利电力与清洁能源",
  },
  energy_mining: {
    lo: "ພະລັງງານ & ບໍ່ແຮ່",
    th: "พลังงาน & เหมืองแร่",
    en: "Energy & Mining",
    zh: "煤炭开采与综合能源",
  },

  // Japan specific
  automotive_industrial: {
    lo: "ຍານຍົນ & ອຸດສາຫະກຳ",
    th: "ยานยนต์ & อุตสาหกรรม",
    en: "Automotive & Industrial",
    zh: "汽车制造与工业制造",
  },
  electronics_gaming: {
    lo: "ເຄື່ອງໃຊ້ໄຟຟ້າ & ເກມ",
    th: "เครื่องใช้ไฟฟ้า & เกม",
    en: "Electronics & Entertainment",
    zh: "消费电子与游戏互动",
  },
  investment_tech: {
    lo: "ການລົງທຶນ & ເຕັກໂນໂລຢີ",
    th: "การลงทุน & เทคโนโลยี",
    en: "Tech Investment & Vision",
    zh: "科技投资与资本控股",
  },
  gaming_entertainment: {
    lo: "ເກມ & ຄວາມບັນເທີງ",
    th: "เกม & ความบันเทิง",
    en: "Gaming & Entertainment",
    zh: "互动游戏与数字内容",
  },
  semiconductors: {
    lo: "ເຊມິຄອນດັກເຕີ & ຊິບ",
    th: "เซมิคอนดักเตอร์ & ชิป",
    en: "Semiconductors & Equipment",
    zh: "半导体制造与核心装备",
  },
  sensors_automation: {
    lo: "ເຊັນເຊີ & ລະບົບອັດຕະໂນມັດ",
    th: "เซนเซอร์ & ระบบอัตโนมัติ",
    en: "Sensors & Factory Automation",
    zh: "传感器与工业自动化",
  },
  telecom_network: {
    lo: "ໂທລະຄົມ & ເຄືອຂ່າຍ",
    th: "โทรคมนาคม & เครือข่าย",
    en: "Telecom & Networks",
    zh: "电信运营与网络服务",
  },
  industrial_electronics: {
    lo: "ອຸດສາຫະກຳ & ໄຟຟ້າ",
    th: "อุตสาหกรรม & ไฟฟ้า",
    en: "Industrial & Electrical Systems",
    zh: "综合电机与重工业",
  },
  automotive_motorcycles: {
    lo: "ຍານຍົນ & ລົດຈັກ",
    th: "ยานยนต์ & รถจักรยานยนต์",
    en: "Automobiles & Motorcycles",
    zh: "汽车与摩托车工业",
  },
  auto_parts: {
    lo: "ຊິ້ນສ່ວນຍານຍົນ",
    th: "ชิ้นส่วนยานยนต์",
    en: "Automotive Parts",
    zh: "汽车核心零部件",
  },
  fashion_retail: {
    lo: "ແຟຊັ່ນ & ຄ້າປີກ",
    th: "แฟชั่น & ค้าปลีก",
    en: "Fashion & Retail",
    zh: "品牌服饰与快时尚零售",
  },
  chemicals_materials: {
    lo: "ເຄມີ & ຊິລິຄອນ",
    th: "เคมีภัณฑ์ & ซิลิคอน",
    en: "Chemicals & Silicon Materials",
    zh: "半导体硅片与精细化工",
  },
  trading_investment: {
    lo: "ການຄ້າ & ລົງທຶນ",
    th: "การค้า & การลงทุน",
    en: "Trading & Sogo Shosha",
    zh: "综合商社与跨国贸易",
  },
  pharma_healthcare: {
    lo: "ການແພດ & ຢາ",
    th: "การแพทย์ & ยารักษาโรค",
    en: "Pharmaceuticals & Healthcare",
    zh: "生物制药与现代医药",
  },
  hvac_industrial: {
    lo: "ເຄື່ອງປັບອາກາດ & ອຸດສາຫະກຳ",
    th: "เครื่องปรับอากาศ & อุตสาหกรรม",
    en: "Air Conditioning & HVAC",
    zh: "暖通空调与制冷装备",
  },

  // US specific
  consumer_tech: {
    lo: "ເຕັກໂນໂລຢີຜູ້ບໍລິໂພກ",
    th: "เทคโนโลยีผู้บริโภค",
    en: "Consumer Tech",
    zh: "消费电子与智能科技",
  },
  cloud_software: {
    lo: "ຄລາວ & ຊອບແວ",
    th: "คลาวด์ & ซอฟต์แวร์",
    en: "Cloud & Software",
    zh: "云计算与企业级软件",
  },
  semiconductors_ai: {
    lo: "ເຊມິຄອນດັກເຕີ & AI",
    th: "เซมิคอนดักเตอร์ & AI",
    en: "Semiconductors & AI",
    zh: "人工智能芯片与半导体",
  },
  social_ai: {
    lo: "ໂຊຊຽວມີເດຍ & AI",
    th: "โซเชียลมีเดีย & AI",
    en: "Social Media & AI",
    zh: "社交网络与人工智能",
  },
  ev_cleanenergy: {
    lo: "ຍານຍົນໄຟຟ້າ & ພະລັງງານສະອາດ",
    th: "ยานยนต์ไฟฟ้า & พลังงานสะอาด",
    en: "EV & Clean Energy",
    zh: "智能电动车与清洁能源",
  },
  entertainment_media: {
    lo: "ຄວາມບັນເທີງ & ສື່",
    th: "ความบันเทิง & สื่อ",
    en: "Entertainment & Media",
    zh: "影视流媒体与数字媒体",
  },
  ai_bigdata: {
    lo: "AI & ຂໍ້ມູນຂະໜາດໃຫຍ່",
    th: "AI & บิ๊กดาต้า",
    en: "AI & Big Data",
    zh: "大数据分析与人工智能",
  },
  etf_tech: {
    lo: "ETF ເຕັກໂນໂລຢີ",
    th: "ETF เทคโนโลยี",
    en: "ETF Tech",
    zh: "科技行业ETF",
  },
  etf_industrial: {
    lo: "ETF ອຸດສາຫະກຳ",
    th: "ETF อุตสาหกรรม",
    en: "ETF Industrial",
    zh: "工业指数ETF",
  },
  conglomerate_value: {
    lo: "ກຸ່ມທຸລະກິດ & ຫຸ້ນຄຸນຄ່າ",
    th: "กลุ่มธุรกิจโฮลดิ้ง & หุ้นคุณค่า",
    en: "Conglomerate & Value",
    zh: "多元化控股与价值投资",
  },
  payments_fintech: {
    lo: "ການຊຳລະເງິນ & ຟິນເທັກ",
    th: "ระบบชำระเงิน & ฟินเทค",
    en: "Payments & FinTech",
    zh: "数字支付与金融科技",
  },
  crypto_fintech: {
    lo: "ຄຣິບໂຕ & ຟິນເທັກ",
    th: "คริปโต & ฟินเทค",
    en: "Crypto FinTech",
    zh: "加密资产与金融交易",
  },
  financial_services: {
    lo: "ບໍລິການທາງການເງິນ & ສິນເຊື່ອ",
    th: "บริการทางการเงิน & สินเชื่อ",
    en: "Financial Services & Leasing",
    zh: "综合金融与信贷租赁",
  },
  agriculture_food: {
    lo: "ກະສິກຳ & ອາຫານ",
    th: "เกษตรกรรม & อาหาร",
    en: "Agriculture & Food",
    zh: "农业科技与食品加工",
  },
  services_catering: {
    lo: "ການບໍລິການ & ຈັດລ້ຽງ",
    th: "การบริการ & จัดเลี้ยง",
    en: "Services & Catering",
    zh: "综合服务与航空配餐",
  },
  hospitality_tourism: {
    lo: "ການທ່ອງທ່ຽວ & ໂຮງແຮມ",
    th: "การท่องเที่ยว & โรงแรม",
    en: "Tourism & Hospitality",
    zh: "文旅休闲与酒店运营",
  },
};

// ─────────────────────────────────────────────────────────
// Lao Stocks (LSX) Companies
// ─────────────────────────────────────────────────────────
export const LAO_STOCKS_DATA: Record<string, CompanyInfo> = {
  BCEL: {
    name: {
      lo: "ທະນາຄານການຄ້າຕ່າງປະເທດລາວ ມະຫາຊົນ (BCEL)",
      th: "ธนาคารการค้าต่างประเทศลาว (มหาชน)",
      en: "Banque Pour Le Commerce Exterieur Lao Public (BCEL)",
      zh: "老挝外贸银行 (BCEL)",
    },
    sectorKey: "banking_finance",
  },
  "EDL-GEN": {
    name: {
      lo: "ບໍລິສັດ ຜະລິດ-ໄຟຟ້າລາວ ມະຫາຊົນ (EDL-Gen)",
      th: "บริษัท ผลิต-ไฟฟ้าลาว (มหาชน)",
      en: "EDL-Generation Public Company (EDL-Gen)",
      zh: "老挝电力发电股份公司 (EDL-Gen)",
    },
    sectorKey: "power_energy",
  },
  EDL: {
    name: {
      lo: "ບໍລິສັດ ຜະລິດ-ໄຟຟ້າລາວ ມະຫາຊົນ (EDL-Gen)",
      th: "บริษัท ผลิต-ไฟฟ้าลาว (มหาชน)",
      en: "EDL-Generation Public Company (EDL-Gen)",
      zh: "老挝电力发电股份公司 (EDL-Gen)",
    },
    sectorKey: "power_energy",
  },
  PTL: {
    name: {
      lo: "ບໍລິສັດ ປີໂຕຣລຽມເທຣດດິ້ງລາວ ມະຫາຊົນ (PTL)",
      th: "บริษัท ปิโตรเลียมเทรดดิ้งลาว (มหาชน)",
      en: "Petroleum Trading Lao Public Company (PTL)",
      zh: "老挝石油贸易股份公司 (PTL)",
    },
    sectorKey: "oil_gas",
  },
  SVN: {
    name: {
      lo: "ບໍລິສັດ ສຸວັນນີ ໂຮມເຊັນເຕີ ມະຫາຊົນ (SVN)",
      th: "บริษัท สุวรรณี โฮมเซ็นเตอร์ (มหาชน)",
      en: "Souvanny Home Center Public Company (SVN)",
      zh: "苏万尼家居中心股份公司 (SVN)",
    },
    sectorKey: "commerce_retail",
  },
  PCD: {
    name: {
      lo: "ບໍລິສັດ ພູສີ ກໍ່ສ້າງ ແລະ ພັດທະນາ ມະຫາຊົນ (PCD)",
      th: "บริษัท ภูสี ก่อสร้างและพัฒนา (มหาชน)",
      en: "Phousy Construction & Development Public (PCD)",
      zh: "普西建设开发股份公司 (PCD)",
    },
    sectorKey: "construction",
  },
  LCTC: {
    name: {
      lo: "ບໍລິສັດ ລາວ ເຊັນໂທຣ ໂທລະຄົມ ມະຫາຊົນ (LCTC)",
      th: "บริษัท ลาว เซ็นทรัล โทรคมนาคม (มหาชน)",
      en: "Lao Central Telecommunication Public (LCTC)",
      zh: "老挝中央电信股份公司 (LCTC)",
    },
    sectorKey: "tech_telecom",
  },
  MHTL: {
    name: {
      lo: "ບໍລິສັດ ມະຫາທຶນ ເຊົ່າສິນເຊື່ອ ມະຫາຊົນ (MHTL)",
      th: "บริษัท มหาทุน ลิสซิ่ง (มหาชน)",
      en: "Mahathuen Leasing Public Company (MHTL)",
      zh: "玛哈吞租赁金融股份公司 (MHTL)",
    },
    sectorKey: "financial_services",
  },
  LAT: {
    name: {
      lo: "ບໍລິສັດ ລາວ ອາກໂກຣ ເຕັກ ມະຫາຊົນ (LAT)",
      th: "บริษัท ลาว อะโกร เทค (มหาชน)",
      en: "Lao Agro Tech Public Company (LAT)",
      zh: "老挝农业科技股份公司 (LAT)",
    },
    sectorKey: "agriculture_food",
  },
  VCL: {
    name: {
      lo: "ບໍລິສັດ ວຽງຈັນເຊັນເຕີ ລາວ ມະຫາຊົນ (VCL)",
      th: "บริษัท เวียงจันทน์ เซ็นเตอร์ ลาว (มหาชน)",
      en: "Vientiane Center Lao Public Company (VCL)",
      zh: "万象中心商业地产股份公司 (VCL)",
    },
    sectorKey: "property_realestate",
  },
  LALCO: {
    name: {
      lo: "ບໍລິສັດ ລາວ-ອາຊຽນ ບໍລິການຈັດລ້ຽງ (LALCO)",
      th: "บริษัท ลาว-อาเซียน แคเทอริ่ง / ลิสซิ่ง (มหาชน)",
      en: "Lao Airlines Catering / Lao-Asean Leasing (LALCO)",
      zh: "老挝航空餐饮/东盟租赁股份公司 (LALCO)",
    },
    sectorKey: "services_catering",
  },
  LCS: {
    name: {
      lo: "ບໍລິສັດ ຫຼັກຊັບ ການຄ້າລາວ ມະຫາຊົນ (LCS)",
      th: "บริษัทหลักทรัพย์ การค้าลาว (มหาชน)",
      en: "Lao Commercial Securities Public Company (LCS)",
      zh: "老挝商业证券股份公司 (LCS)",
    },
    sectorKey: "securities_finance",
  },
  JDB: {
    name: {
      lo: "ທະນາຄານ ຮ່ວມພັດທະນາ ມະຫາຊົນ (JDB)",
      th: "ธนาคาร ร่วมพัฒนา (มหาชน)",
      en: "Joint Development Bank Public Company (JDB)",
      zh: "联合开发银行股份公司 (JDB)",
    },
    sectorKey: "banking_finance",
  },
};

// ─────────────────────────────────────────────────────────
// Thai Stocks Companies
// ─────────────────────────────────────────────────────────
export const THAI_STOCKS_DATA: Record<string, CompanyInfo> = {
  "PTT.BK": {
    name: {
      lo: "ປຕທ. (PTT Public Company)",
      th: "ปตท. (PTT Public Company)",
      en: "PTT Public Company Limited",
      zh: "泰国国家石油公司 (PTT)",
    },
    sectorKey: "energy_utilities",
  },
  "AOT.BK": {
    name: {
      lo: "ທ່າອາກາດສະຍານໄທ (Airports of Thailand)",
      th: "ท่าอากาศยานไทย (Airports of Thailand)",
      en: "Airports of Thailand (AOT)",
      zh: "泰国机场集团 (AOT)",
    },
    sectorKey: "transport_logistics",
  },
  "CPALL.BK": {
    name: {
      lo: "ຊີພີ ອໍລ໌ (7-Eleven Thailand)",
      th: "ซีพี ออลล์ (7-Eleven Thailand)",
      en: "CP ALL Public Company (7-Eleven)",
      zh: "正大CP ALL (7-Eleven Thailand)",
    },
    sectorKey: "commerce_retail",
  },
  "DELTA.BK": {
    name: {
      lo: "ເດວຕ້າ ອີເລັກໂທຣນິກສ໌ (Delta Electronics)",
      th: "เดลต้า อีเลคโทรนิคส์ (Delta Electronics)",
      en: "Delta Electronics Thailand",
      zh: "台达电子泰国 (Delta Electronics)",
    },
    sectorKey: "electronics",
  },
  "BDMS.BK": {
    name: {
      lo: "ບາງກອກ ດຸສິດ ເວດຊະການ (Bangkok Dusit Med)",
      th: "กรุงเทพดุสิตเวชการ (Bangkok Dusit Med)",
      en: "Bangkok Dusit Medical Services",
      zh: "曼谷杜斯特医疗集团 (BDMS)",
    },
    sectorKey: "healthcare",
  },
  "GULF.BK": {
    name: {
      lo: "ກັລຟ໌ ເອັນເນີຈີ ດີເວລລອບເມັ້ນ (Gulf Energy)",
      th: "กัลฟ์ เอ็นเนอร์จี (Gulf Energy)",
      en: "Gulf Energy Development",
      zh: "海湾能源开发 (Gulf Energy)",
    },
    sectorKey: "power_energy",
  },
  "ADVANC.BK": {
    name: {
      lo: "ແອດວານຊ໌ ອິນໂຟຣ໌ ເຊີວິສ (AIS)",
      th: "แอดวานซ์ อินโฟร์ เซอร์วิส (AIS)",
      en: "Advanced Info Service (AIS)",
      zh: "先进信息服务 (AIS)",
    },
    sectorKey: "tech_telecom",
  },
  "KBANK.BK": {
    name: {
      lo: "ທະນາຄານກະສິກອນໄທ (Kasikornbank)",
      th: "ธนาคารกสิกรไทย (Kasikornbank)",
      en: "Kasikornbank (KBANK)",
      zh: "开泰银行 (Kasikornbank)",
    },
    sectorKey: "banking_finance",
  },
  "SCB.BK": {
    name: {
      lo: "ເອສຊີບີ ເອກສ໌ (SCB X)",
      th: "เอสซีบี เอกซ์ (SCB X)",
      en: "SCB X Public Company",
      zh: "汇商银行控股 (SCB X)",
    },
    sectorKey: "banking_finance",
  },
  "SCC.BK": {
    name: {
      lo: "ປູນຊີມັງໄທ (Siam Cement Group)",
      th: "ปูนซิเมนต์ไทย (Siam Cement Group)",
      en: "Siam Cement Group (SCG)",
      zh: "暹罗水泥集团 (SCG)",
    },
    sectorKey: "construction",
  },
  "BBL.BK": {
    name: {
      lo: "ທະນາຄານກຸງເທບ (Bangkok Bank)",
      th: "ธนาคารกรุงเทพ (Bangkok Bank)",
      en: "Bangkok Bank (BBL)",
      zh: "盘谷银行 (Bangkok Bank)",
    },
    sectorKey: "banking_finance",
  },
  "TRUE.BK": {
    name: {
      lo: "ທຣູ ຄໍປໍເຣຊັ່ນ (True Corporation)",
      th: "ทรู คอร์ปอเรชั่น (True Corporation)",
      en: "True Corporation",
      zh: "True电信集团",
    },
    sectorKey: "tech_telecom",
  },
  "PTTEP.BK": {
    name: {
      lo: "ປຕທ. ສຳຫຼວດ ແລະ ຜະລິດປິໂຕຣລຽມ",
      th: "ปตท. สำรวจและผลิตปิโตรเลียม (PTTEP)",
      en: "PTT Exploration & Production (PTTEP)",
      zh: "PTT勘探生产公司 (PTTEP)",
    },
    sectorKey: "oil_gas",
  },
  "KTB.BK": {
    name: {
      lo: "ທະນາຄານກຸງໄທ (Krungthai Bank)",
      th: "ธนาคารกรุงไทย (Krungthai Bank)",
      en: "Krungthai Bank (KTB)",
      zh: "泰京银行 (Krungthai Bank)",
    },
    sectorKey: "banking_finance",
  },
  "CPN.BK": {
    name: {
      lo: "ເຊັນຊັລ ພັດທະນາ (Central Pattana)",
      th: "เซ็นทรัลพัฒนา (Central Pattana)",
      en: "Central Pattana (CPN)",
      zh: "中央置业开发 (Central Pattana)",
    },
    sectorKey: "property_realestate",
  },
  "CRC.BK": {
    name: {
      lo: "ເຊັນຊັລ ຣີເທລ (Central Retail)",
      th: "เซ็นทรัล รีเทล (Central Retail)",
      en: "Central Retail Corporation (CRC)",
      zh: "中央零售集团 (Central Retail)",
    },
    sectorKey: "commerce_retail",
  },
  "MINT.BK": {
    name: {
      lo: "ໄມເນີຣ໌ ອິນເຕີເນຊັ່ນແນລ (Minor International)",
      th: "ไมเนอร์ อินเตอร์เนชั่นแนล (Minor)",
      en: "Minor International (MINT)",
      zh: "美诺国际酒店集团 (MINT)",
    },
    sectorKey: "hospitality_food",
  },
  "BANPU.BK": {
    name: {
      lo: "ບ້ານປູ (Banpu)",
      th: "บ้านปู (Banpu)",
      en: "Banpu Public Company",
      zh: "万浦矿业能源 (Banpu)",
    },
    sectorKey: "energy_coal",
  },
  "WHA.BK": {
    name: {
      lo: "ດັບບລິວເອສເອ ຄໍປໍເຣຊັ່ນ (WHA Corp)",
      th: "ดับบลิวเอชเอ คอร์ปอเรชั่น (WHA Corp)",
      en: "WHA Corporation",
      zh: "WHA工业地产物流",
    },
    sectorKey: "industrial_estate",
  },
  "BH.BK": {
    name: {
      lo: "ໂຮງໝໍບຳລຸງລາດ (Bumrungrad Hospital)",
      th: "โรงพยาบาลบำรุงราษฎร์ (Bumrungrad)",
      en: "Bumrungrad International Hospital",
      zh: "康民国际医院 (Bumrungrad)",
    },
    sectorKey: "healthcare",
  },
};

// ─────────────────────────────────────────────────────────
// Vietnam Stocks Companies
// ─────────────────────────────────────────────────────────
export const VIETNAM_STOCKS_DATA: Record<string, CompanyInfo> = {
  "VCB.VN": {
    name: {
      lo: "ທະນາຄານຫວຽດຄອມ (Vietcombank)",
      th: "ธนาคารเวียตคอม (Vietcombank)",
      en: "Vietcombank (Foreign Trade Bank)",
      zh: "越南外贸股份商业银行 (Vietcombank)",
    },
    sectorKey: "banking_finance",
  },
  "VNM.VN": {
    name: {
      lo: "ວິນາມິລຄ໌ (Vinamilk)",
      th: "วินามิลค์ (Vinamilk)",
      en: "Vinamilk (Vietnam Dairy)",
      zh: "越南乳业股份公司 (Vinamilk)",
    },
    sectorKey: "food_beverage",
  },
  "VIC.VN": {
    name: {
      lo: "ວິນກຣຸບ (Vingroup)",
      th: "วินกรุ๊ป (Vingroup)",
      en: "Vingroup Joint Stock Company",
      zh: "温纳集团 (Vingroup)",
    },
    sectorKey: "realestate_conglomerate",
  },
  "VHM.VN": {
    name: {
      lo: "ວິນໂຮມສ໌ (Vinhomes)",
      th: "วินโฮมส์ (Vinhomes)",
      en: "Vinhomes Joint Stock Company",
      zh: "温纳房产 (Vinhomes)",
    },
    sectorKey: "property_realestate",
  },
  "HPG.VN": {
    name: {
      lo: "ກຸ່ມຮວ່າຟາດ (Hoa Phat Group)",
      th: "ฮว่าฟัท กรุ๊ป (Hoa Phat Group)",
      en: "Hoa Phat Group (Steel & Industrial)",
      zh: "和发集团 (Hoa Phat Steel)",
    },
    sectorKey: "industrial_steel",
  },
  "FPT.VN": {
    name: {
      lo: "ເອຟພີທີ ຄໍປໍເຣຊັ່ນ (FPT Corporation)",
      th: "เอฟพีที คอร์ปอเรชั่น (FPT Corp)",
      en: "FPT Corporation (Technology)",
      zh: "FPT科技软件集团",
    },
    sectorKey: "tech_software",
  },
  "TCB.VN": {
    name: {
      lo: "ທະນາຄານເຕັກຄອມ (Techcombank)",
      th: "ธนาคารเทคคอม (Techcombank)",
      en: "Techcombank (Vietnam Tech & Comm)",
      zh: "越南科技及商业股份银行",
    },
    sectorKey: "banking_finance",
  },
  "MSN.VN": {
    name: {
      lo: "ມາຊານ ກຣຸບ (Masan Group)",
      th: "มาซาน กรุ๊ป (Masan Group)",
      en: "Masan Group Corporation",
      zh: "马山消费集团 (Masan Group)",
    },
    sectorKey: "consumer_retail",
  },
  "BID.VN": {
    name: {
      lo: "ທະນາຄານ BIDV (Bank for Inv. & Dev.)",
      th: "ธนาคาร BIDV (Bank for Inv. & Dev.)",
      en: "BIDV Bank for Inv. & Dev. of Vietnam",
      zh: "越南投资发展银行 (BIDV)",
    },
    sectorKey: "banking_finance",
  },
  "GAS.VN": {
    name: {
      lo: "ປິໂຕຣຫວຽດນາມ ກ໊າຊ (PV Gas)",
      th: "เปโตรเวียดนาม ก๊าซ (PV Gas)",
      en: "PetroVietnam Gas (PV Gas)",
      zh: "越南国家石油天然气 (PV Gas)",
    },
    sectorKey: "oil_gas",
  },
  "SSI.VN": {
    name: {
      lo: "ຫຼັກຊັບ SSI (SSI Securities)",
      th: "หลักทรัพย์ SSI (SSI Securities)",
      en: "SSI Securities Corporation",
      zh: "西贡证券股份公司 (SSI)",
    },
    sectorKey: "securities_finance",
  },
  "MWG.VN": {
    name: {
      lo: "ໂມບາຍເວີລດ໌ (Mobile World Corp)",
      th: "โมบายเวิลด์ (Mobile World Corp)",
      en: "Mobile World Investment Corp",
      zh: "越南移动世界集团 (MWG)",
    },
    sectorKey: "commerce_retail",
  },
  "VRE.VN": {
    name: {
      lo: "ວິນຄອມ ຣີເທລ (Vincom Retail)",
      th: "วินคอม รีเทล (Vincom Retail)",
      en: "Vincom Retail Joint Stock Company",
      zh: "温纳商业零售中心 (Vincom Retail)",
    },
    sectorKey: "realestate_malls",
  },
  "MBB.VN": {
    name: {
      lo: "ທະນາຄານທະຫານ (Military Bank)",
      th: "ธนาคารทหาร (Military Bank)",
      en: "Military Commercial Joint Stock Bank",
      zh: "越南军队股份商业银行 (MB Bank)",
    },
    sectorKey: "banking_finance",
  },
  "HDB.VN": {
    name: {
      lo: "ທະນາຄານ HDBank",
      th: "ธนาคาร HDBank",
      en: "HD Bank (Ho Chi Minh City)",
      zh: "胡志明市开发股份商业银行 (HDBank)",
    },
    sectorKey: "banking_finance",
  },
  "VPB.VN": {
    name: {
      lo: "ທະນາຄານ VPBank",
      th: "ธนาคาร VPBank",
      en: "VPBank (Vietnam Prosperity Bank)",
      zh: "越南盛旺股份商业银行 (VPBank)",
    },
    sectorKey: "banking_finance",
  },
  "SAB.VN": {
    name: {
      lo: "ເບຍໄຊງ່ອນ (Sabeco)",
      th: "เบียร์ไซ่ง่อน (Sabeco)",
      en: "Sabeco (Saigon Beer)",
      zh: "西贡啤酒饮料股份公司 (Sabeco)",
    },
    sectorKey: "food_beverage",
  },
  "PLX.VN": {
    name: {
      lo: "ປິໂຕຣລິເມັກສ໌ (Petrolimex)",
      th: "เปโตรลิเมกซ์ (Petrolimex)",
      en: "Petrolimex (Vietnam National Petroleum)",
      zh: "越南国家石油集团 (Petrolimex)",
    },
    sectorKey: "oil_gas",
  },
  "BVH.VN": {
    name: {
      lo: "ບາວຫວຽດ ໂຮລດິ້ງສ໌ (Bao Viet Holdings)",
      th: "บาวเวียด โฮลดิ้งส์ (Bao Viet Holdings)",
      en: "Bao Viet Holdings (Insurance)",
      zh: "保越金融保险控股集团",
    },
    sectorKey: "insurance_finance",
  },
  "VJC.VN": {
    name: {
      lo: "ສາຍການບິນ ຫວຽດເຈັສ (VietJet Air)",
      th: "สายการบิน เวียตเจ็ท (VietJet Air)",
      en: "VietJet Aviation Joint Stock Company",
      zh: "越捷航空股份公司 (VietJet Air)",
    },
    sectorKey: "transport_aviation",
  },
  "VNM": {
    name: {
      lo: "VanEck Vietnam ETF (VN Index ETF)",
      th: "VanEck Vietnam ETF (VN Index ETF)",
      en: "VanEck Vietnam ETF",
      zh: "范埃克越南指数ETF (VanEck Vietnam ETF)",
    },
    sectorKey: "etf_index",
  },
};

// ─────────────────────────────────────────────────────────
// China Stocks Companies
// ─────────────────────────────────────────────────────────
export const CHINA_STOCKS_DATA: Record<string, CompanyInfo> = {
  "600519.SS": {
    name: {
      lo: "ກຸ້ຍໂຈວ ເໝົາໄຖ (Kweichow Moutai)",
      th: "กุ้ยโจว เหมาไถ (Kweichow Moutai)",
      en: "Kweichow Moutai Co., Ltd.",
      zh: "贵州茅台 (Kweichow Moutai)",
    },
    sectorKey: "consumer_beverages",
  },
  "002594.SZ": {
    name: {
      lo: "ບີວາຍດີ (BYD Auto & Battery)",
      th: "บีวายดี (BYD Auto & Battery)",
      en: "BYD Company Limited",
      zh: "比亚迪股份 (BYD Company)",
    },
    sectorKey: "ev_battery",
  },
  "300750.SZ": {
    name: {
      lo: "ຊີເອທີແອວ (CATL Battery)",
      th: "ซีเอทีแอล (CATL Battery)",
      en: "CATL (Contemporary Amperex Tech)",
      zh: "宁德时代 (CATL)",
    },
    sectorKey: "cleanenergy_battery",
  },
  "601398.SS": {
    name: {
      lo: "ທະນາຄານ ICBC (Ind. & Comm. Bank)",
      th: "ธนาคาร ICBC (Ind. & Comm. Bank)",
      en: "Industrial & Commercial Bank of China",
      zh: "工商银行 (ICBC)",
    },
    sectorKey: "banking_finance",
  },
  "601857.SS": {
    name: {
      lo: "ປິໂຕຣໄຊນາ (PetroChina)",
      th: "เปโตรไชน่า (PetroChina)",
      en: "PetroChina Company Limited",
      zh: "中国石油 (PetroChina)",
    },
    sectorKey: "oil_gas",
  },
  "601288.SS": {
    name: {
      lo: "ທະນາຄານກະສິກຳຈີນ (Agri Bank)",
      th: "ธนาคารเพื่อการเกษตรแห่งประเทศจีน (ABC)",
      en: "Agricultural Bank of China",
      zh: "农业银行 (Agri Bank)",
    },
    sectorKey: "banking_finance",
  },
  "000858.SZ": {
    name: {
      lo: "ອູຫຼຽງເຢ່ (Wuliangye Yibin)",
      th: "อู่เหลียงเย่ (Wuliangye Yibin)",
      en: "Wuliangye Yibin Co., Ltd.",
      zh: "五粮液 (Wuliangye Yibin)",
    },
    sectorKey: "consumer_beverages",
  },
  "000333.SZ": {
    name: {
      lo: "ໄມເດຍ ກຣຸບ (Midea Group)",
      th: "ไมเดีย กรุ๊ป (Midea Group)",
      en: "Midea Group Co., Ltd.",
      zh: "美的集团 (Midea Group)",
    },
    sectorKey: "appliances_electronics",
  },
  "BABA": {
    name: {
      lo: "ອາລີບາບາ (Alibaba Group)",
      th: "อาลีบาบา (Alibaba Group)",
      en: "Alibaba Group Holding Limited",
      zh: "阿里巴巴 (Alibaba Group)",
    },
    sectorKey: "ecommerce_cloud",
  },
  "PDD": {
    name: {
      lo: "ພິນຕົວຕົວ / ເທີມູ (PDD Holdings)",
      th: "พินตัวตัว / เทมู (PDD Holdings)",
      en: "PDD Holdings Inc. (Temu / Pinduoduo)",
      zh: "拼多多 / TEMU (PDD Holdings)",
    },
    sectorKey: "ecommerce",
  },
  "TCEHY": {
    name: {
      lo: "ເທັນເຊັນ (Tencent Holdings)",
      th: "เทนเซ็นต์ (Tencent Holdings)",
      en: "Tencent Holdings Limited",
      zh: "腾讯控股 (Tencent Holdings)",
    },
    sectorKey: "gaming_tech",
  },
  "600036.SS": {
    name: {
      lo: "ທະນາຄານ ຈີນຊາງ (China Merchants)",
      th: "ธนาคาร เจาซาง (China Merchants Bank)",
      en: "China Merchants Bank Co., Ltd.",
      zh: "招商银行 (China Merchants Bank)",
    },
    sectorKey: "banking_finance",
  },
  "601988.SS": {
    name: {
      lo: "ທະນາຄານແຫ່ງປະເທດຈີນ (Bank of China)",
      th: "ธนาคารแห่งประเทศจีน (Bank of China)",
      en: "Bank of China Limited",
      zh: "中国银行 (Bank of China)",
    },
    sectorKey: "banking_finance",
  },
  "600900.SS": {
    name: {
      lo: "ໄຊນາ ແຍງຊີ ພາວເວີ (Yangtze Power)",
      th: "ไชน่า แยงซี พาวเวอร์ (Yangtze Power)",
      en: "China Yangtze Power Co., Ltd.",
      zh: "长江电力 (Yangtze Power)",
    },
    sectorKey: "utilities_power",
  },
  "002475.SZ": {
    name: {
      lo: "ລັກຊ໌ແຊຣ໌ ພຣິຊິຊັ່ນ (Luxshare Prec.)",
      th: "ลักซ์แชร์ พรีซิชั่น (Luxshare Precision)",
      en: "Luxshare Precision Industry Co.",
      zh: "立讯精密 (Luxshare Precision)",
    },
    sectorKey: "electronics",
  },
  "601088.SS": {
    name: {
      lo: "ໄຊນາ ເຊິນຮວາ (China Shenhua)",
      th: "ไชน่า เสินหัว (China Shenhua)",
      en: "China Shenhua Energy Co., Ltd.",
      zh: "中国神华 (China Shenhua)",
    },
    sectorKey: "energy_mining",
  },
  "600030.SS": {
    name: {
      lo: "ຫຼັກຊັບ CITIC (CITIC Securities)",
      th: "หลักทรัพย์ CITIC (CITIC Securities)",
      en: "CITIC Securities Co., Ltd.",
      zh: "中信证券 (CITIC Securities)",
    },
    sectorKey: "securities_finance",
  },
  "601318.SS": {
    name: {
      lo: "ຜິງອ່ານ ປະກັນໄພ (Ping An Insurance)",
      th: "ผิงอัน ประกันภัย (Ping An Insurance)",
      en: "Ping An Insurance (Group) of China",
      zh: "中国平安 (Ping An Insurance)",
    },
    sectorKey: "insurance_finance",
  },
};

// ─────────────────────────────────────────────────────────
// Japan Stocks Companies
// ─────────────────────────────────────────────────────────
export const JAPAN_STOCKS_DATA: Record<string, CompanyInfo> = {
  "7203.T": {
    name: {
      lo: "ໂຕໂຢຕ້າ ມໍເຕີ (Toyota Motor)",
      th: "โตโยต้า มอเตอร์ (Toyota Motor)",
      en: "Toyota Motor Corporation",
      zh: "丰田汽车 (Toyota Motor)",
    },
    sectorKey: "automotive_industrial",
  },
  "6758.T": {
    name: {
      lo: "ໂຊນີ ກຣຸບ (Sony Group)",
      th: "โซนี่ กรุ๊ป (Sony Group)",
      en: "Sony Group Corporation",
      zh: "索尼集团 (Sony Group)",
    },
    sectorKey: "electronics_gaming",
  },
  "9984.T": {
    name: {
      lo: "ຊັອຟທ໌ແບງຄ໌ ກຣຸບ (SoftBank Group)",
      th: "ซอฟต์แบงก์ กรุ๊ป (SoftBank Group)",
      en: "SoftBank Group Corp.",
      zh: "软银集团 (SoftBank Group)",
    },
    sectorKey: "investment_tech",
  },
  "7974.T": {
    name: {
      lo: "ນິນເທັນໂດ (Nintendo)",
      th: "นินเทนโด (Nintendo)",
      en: "Nintendo Co., Ltd.",
      zh: "任天堂 (Nintendo)",
    },
    sectorKey: "gaming_entertainment",
  },
  "8035.T": {
    name: {
      lo: "ໂຕກຽວ ອິເລັກຕຣອນ (Tokyo Electron)",
      th: "โตเกียว อิเล็กตรอน (Tokyo Electron)",
      en: "Tokyo Electron Limited",
      zh: "东京电子 (Tokyo Electron)",
    },
    sectorKey: "semiconductors",
  },
  "6861.T": {
    name: {
      lo: "ຄີເອນສ໌ (Keyence Corporation)",
      th: "คีย์เอนซ์ (Keyence Corporation)",
      en: "Keyence Corporation (Automation)",
      zh: "基恩士 (Keyence Corporation)",
    },
    sectorKey: "sensors_automation",
  },
  "8306.T": {
    name: {
      lo: "ມິດຊູບິຊິ UFJ (MUFG Bank)",
      th: "มิตซูบิชิ ยูเอฟเจ (MUFG Bank)",
      en: "Mitsubishi UFJ Financial Group",
      zh: "三菱日联金融集团 (MUFG Bank)",
    },
    sectorKey: "banking_finance",
  },
  "9432.T": {
    name: {
      lo: "ເອັນທີທີ (NTT Telecom)",
      th: "เอ็นทีที (NTT Telecom)",
      en: "Nippon Telegraph and Telephone (NTT)",
      zh: "日本电信电话 (NTT Telecom)",
    },
    sectorKey: "telecom_network",
  },
  "6501.T": {
    name: {
      lo: "ຮິຕາຊິ (Hitachi)",
      th: "ฮิตาชิ (Hitachi)",
      en: "Hitachi, Ltd.",
      zh: "日立制作所 (Hitachi)",
    },
    sectorKey: "industrial_electronics",
  },
  "7267.T": {
    name: {
      lo: "ຮອນດ້າ ມໍເຕີ (Honda Motor)",
      th: "ฮอนด้า มอเตอร์ (Honda Motor)",
      en: "Honda Motor Co., Ltd.",
      zh: "本田技研工业 (Honda Motor)",
    },
    sectorKey: "automotive_motorcycles",
  },
  "6902.T": {
    name: {
      lo: "ເດນໂຊ (Denso Corporation)",
      th: "เดนโซ่ (Denso Corporation)",
      en: "Denso Corporation",
      zh: "日本电装 (Denso Corporation)",
    },
    sectorKey: "auto_parts",
  },
  "9983.T": {
    name: {
      lo: "ຟາສຕ໌ ຣີເທລລິ້ງ / ຢູນິໂຄລ (Fast Retailing)",
      th: "ฟาสต์ รีเทลลิ่ง / ยูนิโคล่ (Fast Retailing)",
      en: "Fast Retailing Co., Ltd. (UNIQLO)",
      zh: "迅销集团 / 优衣库 (Fast Retailing)",
    },
    sectorKey: "fashion_retail",
  },
  "4063.T": {
    name: {
      lo: "ຊິນ-ເອສຶ ເຄມີຄອນ (Shin-Etsu Chemical)",
      th: "ชิน-เอ็ทสึ เคมิคอล (Shin-Etsu Chemical)",
      en: "Shin-Etsu Chemical Co., Ltd.",
      zh: "信越化学工业 (Shin-Etsu Chemical)",
    },
    sectorKey: "chemicals_materials",
  },
  "8001.T": {
    name: {
      lo: "ອິໂຕຊູ ຄໍປໍເຣຊັ່ນ (Itochu)",
      th: "อิโตชู คอร์ปอเรชั่น (Itochu)",
      en: "ITOCHU Corporation",
      zh: "伊藤忠商事 (Itochu Corporation)",
    },
    sectorKey: "trading_investment",
  },
  "8058.T": {
    name: {
      lo: "ມິດຊູບິຊິ ຄໍປໍເຣຊັ່ນ (Mitsubishi Corp)",
      th: "มิตซูบิชิ คอร์ปอเรชั่น (Mitsubishi Corp)",
      en: "Mitsubishi Corporation",
      zh: "三菱商事 (Mitsubishi Corporation)",
    },
    sectorKey: "trading_investment",
  },
  "4502.T": {
    name: {
      lo: "ທາເຄດະ ຟາຣ໌ມາ (Takeda Pharmaceutical)",
      th: "ทาเคดา ฟาร์มา (Takeda Pharmaceutical)",
      en: "Takeda Pharmaceutical Company",
      zh: "武田药品工业 (Takeda Pharmaceutical)",
    },
    sectorKey: "pharma_healthcare",
  },
  "6367.T": {
    name: {
      lo: "ໄດກິ້ນ ອິນດັສທຣີສ໌ (Daikin Industries)",
      th: "ไดกิ้น อินดัสทรีส์ (Daikin Industries)",
      en: "Daikin Industries, Ltd.",
      zh: "大金工业 (Daikin Industries)",
    },
    sectorKey: "hvac_industrial",
  },
  "6981.T": {
    name: {
      lo: "ມູຣາຕະ ແມນູແຟັກເຈີຣິງ (Murata Mfg)",
      th: "มูราตะ แมนูแฟคเจอริ่ง (Murata Mfg)",
      en: "Murata Manufacturing Co., Ltd.",
      zh: "村田制作所 (Murata Manufacturing)",
    },
    sectorKey: "electronics",
  },
};

// ─────────────────────────────────────────────────────────
// US Stocks Companies
// ─────────────────────────────────────────────────────────
export const US_STOCKS_DATA: Record<string, CompanyInfo> = {
  AAPL: {
    name: {
      lo: "ແອບເປີ້ນ (Apple Inc.)",
      th: "แอปเปิ้ล (Apple Inc.)",
      en: "Apple Inc.",
      zh: "苹果公司 (Apple Inc.)",
    },
    sectorKey: "consumer_tech",
  },
  MSFT: {
    name: {
      lo: "ໄມໂຄຣຊອບທ໌ (Microsoft)",
      th: "ไมโครซอฟท์ (Microsoft)",
      en: "Microsoft Corporation",
      zh: "微软公司 (Microsoft Corporation)",
    },
    sectorKey: "cloud_software",
  },
  NVDA: {
    name: {
      lo: "ເອັນວີເດຍ (NVIDIA)",
      th: "อินวิเดีย (NVIDIA)",
      en: "NVIDIA Corporation",
      zh: "英伟达 (NVIDIA Corporation)",
    },
    sectorKey: "semiconductors_ai",
  },
  AMZN: {
    name: {
      lo: "ອະເມຊອນ (Amazon)",
      th: "อเมซอน (Amazon)",
      en: "Amazon.com Inc.",
      zh: "亚马逊公司 (Amazon.com)",
    },
    sectorKey: "ecommerce_cloud",
  },
  GOOGL: {
    name: {
      lo: "ກູເກິລ (Alphabet / Google)",
      th: "กูเกิล (Alphabet / Google)",
      en: "Alphabet Inc. (Google)",
      zh: "谷歌母公司 (Alphabet / Google)",
    },
    sectorKey: "tech_telecom",
  },
  META: {
    name: {
      lo: "ເມຕາ (Meta Platforms / Facebook)",
      th: "เมตา (Meta Platforms / Facebook)",
      en: "Meta Platforms Inc.",
      zh: "Meta平台 (Facebook)",
    },
    sectorKey: "social_ai",
  },
  TSLA: {
    name: {
      lo: "ເທສລາ (Tesla Inc.)",
      th: "เทสลา (Tesla Inc.)",
      en: "Tesla Inc.",
      zh: "特斯拉汽车 (Tesla Inc.)",
    },
    sectorKey: "ev_cleanenergy",
  },
  AMD: {
    name: {
      lo: "ເອເອັມດີ (Advanced Micro Devices)",
      th: "เอเอ็มดี (AMD)",
      en: "Advanced Micro Devices Inc.",
      zh: "超威半导体 (AMD)",
    },
    sectorKey: "semiconductors",
  },
  NFLX: {
    name: {
      lo: "ເນັດຟລິກສ໌ (Netflix)",
      th: "เน็ตฟลิกซ์ (Netflix)",
      en: "Netflix Inc.",
      zh: "奈飞 (Netflix Inc.)",
    },
    sectorKey: "entertainment_media",
  },
  PLTR: {
    name: {
      lo: "ພາລານເທຍຣ໌ (Palantir)",
      th: "พาแลนเทียร์ (Palantir)",
      en: "Palantir Technologies Inc.",
      zh: "帕兰提尔科技 (Palantir)",
    },
    sectorKey: "ai_bigdata",
  },
  SPY: {
    name: {
      lo: "SPDR S&P 500 ETF",
      th: "SPDR S&P 500 ETF",
      en: "SPDR S&P 500 ETF Trust",
      zh: "标普500指数基金 (SPDR S&P 500 ETF)",
    },
    sectorKey: "etf_index",
  },
  QQQ: {
    name: {
      lo: "Invesco QQQ (Nasdaq-100 ETF)",
      th: "Invesco QQQ (Nasdaq-100 ETF)",
      en: "Invesco QQQ Trust",
      zh: "纳斯达克100指数基金 (Invesco QQQ)",
    },
    sectorKey: "etf_tech",
  },
  DIA: {
    name: {
      lo: "SPDR Dow Jones Industrial ETF",
      th: "SPDR Dow Jones Industrial ETF",
      en: "SPDR Dow Jones Industrial ETF",
      zh: "道琼斯指数ETF (SPDR Dow Jones ETF)",
    },
    sectorKey: "etf_industrial",
  },
  "BRK-B": {
    name: {
      lo: "ເບີຣ໌ກໄຊຍ໌ ຮາທາເວ (Berkshire Hathaway)",
      th: "เบิร์กเชียร์ ฮาธาเวย์ (Berkshire Hathaway)",
      en: "Berkshire Hathaway Inc.",
      zh: "伯克希尔·哈撒韦 (Berkshire Hathaway)",
    },
    sectorKey: "conglomerate_value",
  },
  JPM: {
    name: {
      lo: "ເຈພີມໍແກນ ເຊສ (JPMorgan Chase)",
      th: "เจพีมอร์แกน เชส (JPMorgan Chase)",
      en: "JPMorgan Chase & Co.",
      zh: "摩根大通银行 (JPMorgan Chase)",
    },
    sectorKey: "banking_finance",
  },
  V: {
    name: {
      lo: "ວີຊາ (Visa Inc.)",
      th: "วีซ่า (Visa Inc.)",
      en: "Visa Inc.",
      zh: "威士信用卡 (Visa Inc.)",
    },
    sectorKey: "payments_fintech",
  },
  WMT: {
    name: {
      lo: "ວໍລມາດ (Walmart Inc.)",
      th: "วอลมาร์ต (Walmart Inc.)",
      en: "Walmart Inc.",
      zh: "沃尔玛百货 (Walmart Inc.)",
    },
    sectorKey: "commerce_retail",
  },
  DIS: {
    name: {
      lo: "ດິສນີ (The Walt Disney Company)",
      th: "ดิสนีย์ (Walt Disney)",
      en: "The Walt Disney Company",
      zh: "华特迪士尼公司 (Walt Disney)",
    },
    sectorKey: "entertainment_media",
  },
  COIN: {
    name: {
      lo: "ຄອຍເບສ (Coinbase Global)",
      th: "คอยน์เบส (Coinbase Global)",
      en: "Coinbase Global Inc.",
      zh: "Coinbase数字货币交易平台",
    },
    sectorKey: "crypto_fintech",
  },
  INTC: {
    name: {
      lo: "ອິນເທລ (Intel Corporation)",
      th: "อินเทล (Intel Corporation)",
      en: "Intel Corporation",
      zh: "英特尔公司 (Intel Corporation)",
    },
    sectorKey: "semiconductors",
  },
};

// ─────────────────────────────────────────────────────────
// Other Assets (Crypto, Commodities, Indices)
// ─────────────────────────────────────────────────────────
export interface AssetMetaInfo {
  name: Record<Language, string>;
  type: "crypto" | "commodity" | "index";
  icon?: string;
}

export const OTHER_ASSETS_DATA: Record<string, AssetMetaInfo> = {
  "BTC-USD": {
    name: { lo: "Bitcoin", th: "Bitcoin (บิตคอยน์)", en: "Bitcoin", zh: "比特币 (Bitcoin)" },
    type: "crypto",
    icon: "₿",
  },
  "ETH-USD": {
    name: { lo: "Ethereum", th: "Ethereum (อีเธอเรียม)", en: "Ethereum", zh: "以太坊 (Ethereum)" },
    type: "crypto",
    icon: "Ξ",
  },
  "SOL-USD": {
    name: { lo: "Solana", th: "Solana (โซลานา)", en: "Solana", zh: "索拉纳 (Solana)" },
    type: "crypto",
    icon: "◎",
  },
  "BNB-USD": {
    name: { lo: "BNB (Binance)", th: "BNB (ไบแนนซ์)", en: "BNB (Binance)", zh: "币安币 (BNB)" },
    type: "crypto",
    icon: "🟡",
  },
  "XRP-USD": {
    name: { lo: "XRP (Ripple)", th: "XRP (ริปเปิล)", en: "XRP (Ripple)", zh: "瑞波币 (XRP)" },
    type: "crypto",
    icon: "✕",
  },
  "DOGE-USD": {
    name: { lo: "Dogecoin", th: "Dogecoin (โดจคอยน์)", en: "Dogecoin", zh: "狗狗币 (Dogecoin)" },
    type: "crypto",
    icon: "🐕",
  },
  "ADA-USD": {
    name: { lo: "Cardano", th: "Cardano (คาร์ดาโน)", en: "Cardano", zh: "艾达币 (Cardano)" },
    type: "crypto",
    icon: "₳",
  },
  "AVAX-USD": {
    name: { lo: "Avalanche", th: "Avalanche (อะวาแลนซ์)", en: "Avalanche", zh: "雪崩币 (Avalanche)" },
    type: "crypto",
    icon: "🔺",
  },
  "GC=F": {
    name: { lo: "ຄຳໂລກ (Gold Futures)", th: "ทองคำโลก (Gold Futures)", en: "Gold Futures (COMEX)", zh: "COMEX黄金期货 (Gold)" },
    type: "commodity",
    icon: "🥇",
  },
  "CL=F": {
    name: { lo: "ນ້ຳມັນດິບ WTI Crude Oil", th: "น้ำมันดิบ WTI Crude Oil", en: "WTI Crude Oil Futures", zh: "WTI原油期货 (Crude Oil)" },
    type: "commodity",
    icon: "🛢️",
  },
  "SI=F": {
    name: { lo: "ເງິນໂລກ (Silver Futures)", th: "แร่เงินโลก (Silver Futures)", en: "Silver Futures (COMEX)", zh: "COMEX白银期货 (Silver)" },
    type: "commodity",
    icon: "🥈",
  },
  "^N225": {
    name: { lo: "Nikkei 225 (ຍີ່ປຸ່ນ)", th: "Nikkei 225 (ญี่ปุ่น)", en: "Nikkei 225 (Japan)", zh: "日经225指数 (日本)" },
    type: "index",
    icon: "🇯🇵",
  },
  "^HSI": {
    name: { lo: "Hang Seng (ຮ່ອງກົງ)", th: "Hang Seng (ฮ่องกง)", en: "Hang Seng Index (Hong Kong)", zh: "恒生指数 (香港)" },
    type: "index",
    icon: "🇭🇰",
  },
  "^FTSE": {
    name: { lo: "FTSE 100 (ອັງກິດ)", th: "FTSE 100 (อังกฤษ)", en: "FTSE 100 (United Kingdom)", zh: "英国富时100指数 (UK)" },
    type: "index",
    icon: "🇬🇧",
  },
  "^GDAXI": {
    name: { lo: "DAX (ເຢຍລະມັນ)", th: "DAX (เยอรมนี)", en: "DAX 40 (Germany)", zh: "德国DAX40指数 (Germany)" },
    type: "index",
    icon: "🇩🇪",
  },
};

// ─────────────────────────────────────────────────────────
// Helper Lookup Functions
// ─────────────────────────────────────────────────────────
const RAW_SECTOR_MAP: Record<string, string> = {
  "banking & finance": "banking_finance",
  "banking": "banking_finance",
  "energy & utilities": "energy_utilities",
  "energy & petrochemical": "oil_gas",
  "commerce & retailing": "commerce_retail",
  "commerce & retail": "commerce_retail",
  "construction & materials": "construction",
  "telecommunications": "tech_telecom",
  "technology & telecom": "tech_telecom",
  "financial services": "financial_services",
  "agriculture & food": "agriculture_food",
  "real estate & commerce": "property_realestate",
  "property & real estate": "property_realestate",
  "services & catering": "services_catering",
  "securities & finance": "securities_finance",
  "securities & financial": "securities_finance",
  "services & finance": "financial_services",
};

export function getCompanyMeta(symbol: string): CompanyInfo | undefined {
  if (!symbol) return undefined;
  const cleanSymbol = symbol.replace(/^LSX:/i, "").trim().toUpperCase();
  return (
    LAO_STOCKS_DATA[cleanSymbol] ||
    LAO_STOCKS_DATA[symbol] ||
    THAI_STOCKS_DATA[cleanSymbol] ||
    THAI_STOCKS_DATA[symbol] ||
    VIETNAM_STOCKS_DATA[cleanSymbol] ||
    VIETNAM_STOCKS_DATA[symbol] ||
    CHINA_STOCKS_DATA[cleanSymbol] ||
    CHINA_STOCKS_DATA[symbol] ||
    JAPAN_STOCKS_DATA[cleanSymbol] ||
    JAPAN_STOCKS_DATA[symbol] ||
    US_STOCKS_DATA[cleanSymbol] ||
    US_STOCKS_DATA[symbol]
  );
}

export function getLocalizedCompanyName(symbol: string, lang: Language): string {
  const meta = getCompanyMeta(symbol);
  if (!meta) return symbol;
  return meta.name[lang] || meta.name.en || symbol;
}

export function getLocalizedSectorLabel(sectorKeyOrRaw: string, lang: Language): string {
  if (!sectorKeyOrRaw) return "";
  const normalizedKey = RAW_SECTOR_MAP[sectorKeyOrRaw.toLowerCase().trim()] || sectorKeyOrRaw;
  const sector = SECTORS[normalizedKey];
  if (!sector) return sectorKeyOrRaw;
  return sector[lang] || sector.en || sectorKeyOrRaw;
}

export function getMarketSectorsList(
  dataset: Record<string, CompanyInfo>,
  lang: Language
): { key: string; label: string }[] {
  const keys = Array.from(new Set(Object.values(dataset).map((c) => c.sectorKey)));
  return keys.map((key) => ({
    key,
    label: getLocalizedSectorLabel(key, lang),
  }));
}
