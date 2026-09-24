import { Language } from "./translations";
import { getCompanyMeta, getLocalizedSectorLabel } from "./marketData";

export interface AnalysisData {
  score: number;
  trend: string;
  signal: string;
  support?: number;
  resistance?: number;
  stop_loss?: number;
  take_profit?: number;
  summary_text?: string;
  outlook_text?: string;
  recommendation_text?: string;
}

export function getLocalizedTrend(trend: string, score: number, lang: Language): string {
  const isUp = trend?.includes("ຂຶ້ນ") || trend?.toLowerCase().includes("up") || score >= 58;
  const isDown = trend?.includes("ລົງ") || trend?.toLowerCase().includes("down") || score <= 40;

  if (isUp) {
    switch (lang) {
      case "lo": return "ຂາຂຶ້ນ (Uptrend)";
      case "th": return "ขาขึ้น (Uptrend)";
      case "zh": return "多头上行趋势 (Uptrend)";
      case "en": return "Uptrend";
    }
  } else if (isDown) {
    switch (lang) {
      case "lo": return "ຂາລົງ (Downtrend)";
      case "th": return "ขาลง (Downtrend)";
      case "zh": return "空头下行趋势 (Downtrend)";
      case "en": return "Downtrend";
    }
  } else {
    switch (lang) {
      case "lo": return "ແກວ່ງໂຕ (Sideways)";
      case "th": return "แกว่งตัว (Sideways)";
      case "zh": return "区间震荡整理 (Sideways)";
      case "en": return "Sideways";
    }
  }
}

export function getLocalizedAnalysisTexts(
  analysis: AnalysisData,
  lang: Language
): { summary: string; outlook: string; recommendation: string; trend: string } {
  const { score, trend, support = 0, resistance = 0, summary_text, outlook_text, recommendation_text } = analysis;
  const trendLabel = getLocalizedTrend(trend, score, lang);

  if (lang === "lo") {
    return {
      trend: trendLabel,
      summary: summary_text || `ສິນຊັບນີ້ປະຈຸບັນຢູ່ໃນທ່າອ່ຽງ ${trendLabel} ດ້ວຍຄະແນນເຕັກນິກ ${score}/100.`,
      outlook: outlook_text || "",
      recommendation: recommendation_text || "",
    };
  }

  const supStr = support ? support.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";
  const resStr = resistance ? resistance.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

  // Summary Text
  let summary = "";
  if (lang === "th") {
    summary = `สินทรัพย์นี้ปัจจุบันอยู่ในแนวโน้ม ${trendLabel} ด้วยคะแนนเทคนิค ${score}/100 ตัวชี้วัดโมเมนตัมกำลังสะท้อนความเชื่อมั่นของตลาดในทิศทางนี้`;
  } else if (lang === "zh") {
    summary = `该标的当前处于${trendLabel}，综合技术评分为 ${score}/100。动量指标持续反映当前盘面多空资金博弈态势。`;
  } else {
    summary = `This asset is currently in an ${trendLabel} structure with a technical score of ${score}/100, reflecting current market momentum.`;
  }

  // Outlook Text
  let outlook = "";
  if (score >= 60) {
    if (lang === "th") {
      outlook = `ในระยะสั้น 1-2 สัปดาห์ข้างหน้า คาดว่าราคามีโอกาสทดสอบแนวต้านถัดไปที่ ${resStr} หากผ่านแนวต้านนี้ได้ จะเป็นการเปิดรอบขาขึ้นรอบใหม่`;
    } else if (lang === "zh") {
      outlook = `短期（1-2周）内，价格有望上攻测试阻力位 ${resStr}。若有效放量突破该阻力位，将打开进一步上行空间。`;
    } else {
      outlook = `In the short term (1-2 weeks), price is likely to test the next resistance at ${resStr}. A breakout above will open a new upside cycle.`;
    }
  } else if (score <= 40) {
    if (lang === "th") {
      outlook = `ในระยะสั้น 1-2 สัปดาห์ข้างหน้า ราคามีความเสี่ยงที่จะย่อตัวลงทดสอบแนวรับที่ ${supStr} หากหลุดแนวรับนี้ อาจมีแรงเทขายเพิ่มเติม`;
    } else if (lang === "zh") {
      outlook = `短期（1-2周）内，价格存在回踩测试支撑位 ${supStr} 的风险。若有效跌破该支撑位，可能引发进一步抛压。`;
    } else {
      outlook = `In the short term (1-2 weeks), price risks pulling back to test support at ${supStr}. Breaking below may trigger further selling.`;
    }
  } else {
    if (lang === "th") {
      outlook = `คาดว่าราคาจะแกว่งตัวในกรอบ (Sideways) ระหว่างแนวรับ ${supStr} ถึง แนวต้าน ${resStr} เพื่อสร้างฐานราคาก่อนเลือกทิศทาง`;
    } else if (lang === "zh") {
      outlook = `预计价格将在支撑位 ${supStr} 至阻力位 ${resStr} 之间维持区间震荡（Sideways），蓄势筑底后再选择突破方向。`;
    } else {
      outlook = `Price is expected to oscillate sideways between support ${supStr} and resistance ${resStr} to consolidate before choosing direction.`;
    }
  }

  // Recommendation Text
  let recommendation = "";
  if (score >= 75) {
    if (lang === "th") {
      recommendation = `สัญญาณเทคนิคหลายตัวเป็นบวกพร้อมกัน! แรงซื้อคุมตลาดอย่างชัดเจน พิจารณาเข้าซื้อหรือเพิ่มน้ำหนักการลงทุนได้`;
    } else if (lang === "zh") {
      recommendation = `多项技术指标同步多头共振！买盘力量主导盘面，建议积极考虑建仓买入或适度加大投资仓位。`;
    } else {
      recommendation = `Multiple technical indicators are aligned bullish! Strong buying volume dominates. Consider buying or scaling into positions.`;
    }
  } else if (score >= 58) {
    if (lang === "th") {
      recommendation = `แนวโน้มราคามีแรงซื้อสนับสนุน สามารถทยอยซื้อสะสมได้ โดยวางจุด Stop Loss ต่ำกว่าแนวรับเพื่อจำกัดความเสี่ยง`;
    } else if (lang === "zh") {
      recommendation = `价格趋势获得稳健买盘支撑，建议逢低分批吸筹建仓，并严格在支撑位下方设置止损以控制风险。`;
    } else {
      recommendation = `Price trend is backed by buying volume. Accumulation is favorable with a Stop Loss set below support to manage risk.`;
    }
  } else if (score >= 42) {
    if (lang === "th") {
      recommendation = `ตลาดกำลังแกว่งตัวเลือกทิศทาง สัญญาณยังไม่ชัดเจน ผู้ที่มีหุ้นแนะนำให้ถือต่อ ผู้ที่ยังไม่มีควรรอย่อตัวใกล้แนวรับก่อนเข้าซื้อ`;
    } else if (lang === "zh") {
      recommendation = `市场处于震荡蓄势阶段，方向暂不明朗。持股者建议继续耐心持有观望；未持股者建议等待回踩支撑位确认后再择机买入。`;
    } else {
      recommendation = `Market is consolidating without a clear direction. Existing holders should hold; new buyers should wait for dips near support.`;
    }
  } else if (score >= 25) {
    if (lang === "th") {
      recommendation = `สัญญาณเทคนิคเริ่มอ่อนกำลัง มีความเสี่ยงที่ราคาจะปรับฐานลงต่อ ควรพิจารณาขายทำกำไรหรือลดพอร์ตเพื่อจำกัดความเสี่ยง`;
    } else if (lang === "zh") {
      recommendation = `技术动能显著转弱，存在进一步调整走低风险，建议考虑逢高止盈或减仓避险。`;
    } else {
      recommendation = `Technical momentum is weakening with downside correction risk. Consider taking profits or lightening exposure.`;
    }
  } else {
    if (lang === "th") {
      recommendation = `แนวโน้มขาลงรุนแรงและหลุดเส้นค่าเฉลี่ยหลัก ไม่ควรเข้าซื้อโดยเด็ดขาด และควรตัดขาดทุน (Stop Loss) หากถือครองอยู่`;
    } else if (lang === "zh") {
      recommendation = `空头趋势强烈且已跌破多条核心均线，切勿盲目抢反弹，持仓者应果断执行止损策略。`;
    } else {
      recommendation = `Severe downtrend below key moving averages. Strictly avoid new buys and enforce Stop Loss triggers if holding.`;
    }
  }

  return {
    trend: trendLabel,
    summary,
    outlook,
    recommendation,
  };
}

// ─────────────────────────────────────────────────────────
// Countries Dictionary & Localization
// ─────────────────────────────────────────────────────────
export const COUNTRIES: Record<string, Record<Language, string>> = {
  thailand: { lo: "ປະເທດໄທ", th: "ประเทศไทย", en: "Thailand", zh: "泰国" },
  laos: { lo: "ປະເທດລາວ", th: "ประเทศลาว", en: "Laos", zh: "老挝" },
  "lao pdr": { lo: "ປະເທດລາວ", th: "ประเทศลาว", en: "Laos", zh: "老挝" },
  vietnam: { lo: "ປະເທດຫວຽດນາມ", th: "ประเทศเวียดนาม", en: "Vietnam", zh: "越南" },
  china: { lo: "ປະເທດຈີນ", th: "ประเทศจีน", en: "China", zh: "中国" },
  japan: { lo: "ປະເທດຍີ່ປຸ່ນ", th: "ประเทศญี่ปุ่น", en: "Japan", zh: "日本" },
  "united states": { lo: "ສະຫະລັດອາເມລິກາ", th: "สหรัฐอเมริกา", en: "United States", zh: "美国" },
  usa: { lo: "ສະຫະລັດອາເມລິກາ", th: "สหรัฐอเมริกา", en: "United States", zh: "美国" },
  germany: { lo: "ປະເທດເຢຍລະມັນ", th: "ประเทศเยอรมนี", en: "Germany", zh: "德国" },
  "united kingdom": { lo: "ສະຫະລາຊະອານາຈັກ", th: "สหราชอาณาจักร", en: "United Kingdom", zh: "英国" },
  uk: { lo: "ສະຫະລາຊະອານາຈັກ", th: "สหราชอาณาจักร", en: "United Kingdom", zh: "英国" },
  "hong kong": { lo: "ຮ່ອງກົງ", th: "ฮ่องกง", en: "Hong Kong", zh: "中国香港" },
};

export function getLocalizedCountry(country: string | undefined, lang: Language): string {
  if (!country) return "—";
  const key = country.toLowerCase().trim();
  const c = COUNTRIES[key];
  if (!c) return country;
  return c[lang] || c.en || country;
}

// ─────────────────────────────────────────────────────────
// Industries Dictionary & Localization
// ─────────────────────────────────────────────────────────
export const INDUSTRIES: Record<string, Record<Language, string>> = {
  "oil & gas integrated": {
    lo: "ນ້ຳມັນ & ອາຍແກັສ ຄົບວົງຈອນ",
    th: "น้ำมัน & ก๊าซธรรมชาติ ครบวงจร",
    en: "Oil & Gas Integrated",
    zh: "综合油气勘探开采",
  },
  "oil & gas refining & marketing": {
    lo: "ໂຮງກັ່ນນ້ຳມັນ & ການຕະຫຼາດ",
    th: "โรงกลั่นน้ำมัน & การตลาด",
    en: "Oil & Gas Refining & Marketing",
    zh: "石油炼化与成品油分销",
  },
  "oil & gas e&p": {
    lo: "ສຳຫຼວດ & ຂຸດເຈາະນ້ຳມັນ",
    th: "สำรวจ & ขุดเจาะน้ำมัน",
    en: "Oil & Gas E&P",
    zh: "油气勘探与开采",
  },
  "airports & air services": {
    lo: "ສະໜາມບິນ & ການບໍລິການການບິນ",
    th: "สนามบิน & บริการการบิน",
    en: "Airports & Air Services",
    zh: "机场运营与民航服务",
  },
  "department stores": {
    lo: "ຫ້າງສັບພະສິນຄ້າ",
    th: "ห้างสรรพสินค้า",
    en: "Department Stores",
    zh: "百货百货商店与零售",
  },
  "grocery stores": {
    lo: "ຮ້ານສະດວກຊື້ & ຊຸບເປີມາເກັດ",
    th: "ร้านสะดวกซื้อ & ซูเปอร์มาร์เก็ต",
    en: "Grocery & Convenience Stores",
    zh: "连锁超市与便利店",
  },
  "semiconductors": {
    lo: "ເຊມິຄອນດັກເຕີ & ຊິບ",
    th: "เซมิคอนดักเตอร์ & ชิป",
    en: "Semiconductors",
    zh: "半导体与集成电路制造",
  },
  "consumer electronics": {
    lo: "ເຄື່ອງໃຊ້ໄຟຟ້າ & ເອເລັກໂຕຣນິກ",
    th: "เครื่องใช้ไฟฟ้าและอิเล็กทรอนิกส์",
    en: "Consumer Electronics",
    zh: "消费电子产品与智能硬件",
  },
  "auto manufacturers": {
    lo: "ຜະລິດ ແລະ ປະກອບລົດຍົນ",
    th: "ผลิตและประกอบยานยนต์",
    en: "Auto Manufacturers",
    zh: "汽车制造与整车研发",
  },
  "banks - diversified": {
    lo: "ທະນາຄານພານິດ ຄົບວົງຈອນ",
    th: "ธนาคารพาณิชย์ ครบวงจร",
    en: "Diversified Banks",
    zh: "综合商业银行与金融",
  },
  "banks - regional": {
    lo: "ທະນາຄານທຸລະກິດ",
    th: "ธนาคารพาณิชย์",
    en: "Regional Banks",
    zh: "商业银行与金融服务",
  },
  "internet retail": {
    lo: "ການຄ້າຜ່ານອິນເຕີເນັດ (E-Commerce)",
    th: "ค้าปลีกออนไลน์ (E-Commerce)",
    en: "Internet Retail",
    zh: "互联网电商零售平台",
  },
  "telecom services": {
    lo: "ບໍລິການໂທລະຄົມມະນາຄົມ",
    th: "บริการโทรคมนาคมและเครือข่าย",
    en: "Telecom Services",
    zh: "综合电信与网络运营",
  },
  "software - infrastructure": {
    lo: "ຊອບແວພື້ນຖານ & ຄລາວ",
    th: "ซอฟต์แวร์พื้นฐาน & คลาวด์",
    en: "Software - Infrastructure",
    zh: "基础软件与企业级云计算",
  },
  "beverages - wineries & distilleries": {
    lo: "ເຄື່ອງດື່ມ & ໂຮງກັ່ນສຸລາ",
    th: "เครื่องดื่ม & โรงกลั่นสุรา",
    en: "Beverages - Distilleries",
    zh: "高端白酒与优质饮品",
  },
  "steel": {
    lo: "ອຸດສາຫະກຳເຫຼັກກ້າ",
    th: "อุตสาหกรรมเหล็กกล้า",
    en: "Steel Manufacturing",
    zh: "钢铁冶炼与加工",
  },
};

export function getLocalizedIndustry(industry: string | undefined, lang: Language): string {
  if (!industry) return "—";
  const key = industry.toLowerCase().trim();
  const ind = INDUSTRIES[key];
  if (!ind) return industry;
  return ind[lang] || ind.en || industry;
}

export function getLocalizedSector(symbol: string, rawSector: string | undefined, lang: Language): string {
  const meta = getCompanyMeta(symbol);
  if (meta?.sectorKey) {
    return getLocalizedSectorLabel(meta.sectorKey, lang);
  }
  if (!rawSector) return "—";
  return getLocalizedSectorLabel(rawSector, lang);
}

// ─────────────────────────────────────────────────────────
// Descriptions Dictionary for Key Global & Popular Stocks
// ─────────────────────────────────────────────────────────
export const COMPANY_DESCRIPTIONS: Record<string, Record<Language, string>> = {
  "PTT.BK": {
    zh: "泰国国家石油股份有限公司（PTT Public Company Limited）是泰国最大综合性国有控股能源上市企业。业务涵盖陆上与海上石油与天然气勘探开采、天然气输送管道管网运营、LNG液化天然气接收站、石化衍生品生产以及全球成品油分销零售网络。",
    th: "บริษัท ปตท. จำกัด (มหาชน) กลุ่มธุรกิจพลังงานแห่งชาติชั้นนำของไทย ดำเนินธุรกิจก๊าซธรรมชาติและน้ำมันครบวงจร ครอบคลุมการสำรวจและผลิต ขนส่งผ่านระบบท่อส่งก๊าซ คลังก๊าซธรรมชาติเหลว (LNG) โรงแยกก๊าซ ธุรกิจปิโตรเคมี และสถานีบริการน้ำมันและร้านค้าปลีก",
    lo: "ບໍລິສັດ ປຕທ. ຈຳກັດ (ມະຫາຊົນ) ກຸ່ມທຸລະກິດພະລັງງານແຫ່ງຊາດຊັ້ນນຳຂອງໄທ ດຳເນີນທຸລະກິດນ້ຳມັນ ແລະ ອາຍແກັສຄົບວົງຈອນ ທັງການສຳຫຼວດ ຂຸດຄົ້ນ ລະບົບທໍ່ສົ່ງອາຍແກັສ ໂຮງແຍກອາຍແກັສ ປິໂຕຣເຄມີ ແລະ ສະຖານີບໍລິການນ້ຳມັນ.",
    en: "PTT Public Company Limited is Thailand's premier national energy corporation, operating integrated oil and gas exploration, pipelines, LNG terminals, petrochemicals, and retail stations.",
  },
  "AOT.BK": {
    zh: "泰国机场股份有限公司（Airports of Thailand PCL）是泰国主要国际机场的运营管理机构，旗下管理包括曼谷素万那普、廊曼、普吉等6座核心国际机场，提供全面的航运保障与免税商业运营服务。",
    th: "บริษัท ท่าอากาศยานไทย จำกัด (มหาชน) ผู้ดำเนินธุรกิจท่าอากาศยานสากลหลัก 6 แห่งในประเทศไทย รวมถึงสุวรรณภูมิและดอนเมือง ให้บริการโครงสร้างพื้นฐานการบินและการพาณิชย์ครบวงจร",
    lo: "ບໍລິສັດ ທ່າອາກາດສະຍານໄທ ຈຳກັດ (ມະຫາຊົນ) ຜູ້ຄຸ້ມຄອງ ແລະ ບໍລິຫານສະໜາມບິນສາກົນຫຼັກ 6 ແຫ່ງໃນປະເທດໄທ ລວມທັງສຸວັນນະພູມ ແລະ ດອນເມືອງ.",
    en: "Airports of Thailand Public Company Limited (AOT) operates six major international airports across Thailand, including Suvarnabhumi and Don Mueang.",
  },
  "CPALL.BK": {
    zh: "正大七十一股份有限公司（CP ALL Public Company Limited）隶属于正大集团，是泰国7-Eleven便利店网络的独家特许经营商，并在全泰及周边地区运营万客隆（Makro）与莲花超市（Lotus's）。",
    th: "บริษัท ซีพี ออลล์ จำกัด (มหาชน) ผู้บริหารสิทธิร้านสะดวกซื้อ 7-Eleven ในประเทศไทย พร้อมทั้งดำเนินธุรกิจค้าส่งค้าปลีก Makro และ Lotus's ชั้นนำของภูมิภาค",
    lo: "ບໍລິສັດ ຊີພີ ອອລລ໌ ຈຳກັດ (ມະຫາຊົນ) ຜູ້ບໍລິຫານຮ້ານສະດວກຊື້ 7-Eleven ໃນໄທ ແລະ ທຸລະກິດຄ້າສົ່ງ-ຄ້າປີກ Makro ແລະ Lotus's.",
    en: "CP ALL Public Company Limited operates the 7-Eleven convenience store network in Thailand, alongside wholesale and retail giants Makro and Lotus's.",
  },
  "DELTA.BK": {
    zh: "泰达电子股份有限公司（Delta Electronics Thailand PCL）是全球领先的电源管理与关键电子零部件制造商，核心产品涵盖新能源汽车动力电源系统、工业自动化及AI数据中心高效服务器电源。",
    th: "บริษัท เดลต้า อีเลคโทรนิคส์ (ประเทศไทย) จำกัด (มหาชน) ผู้ผลิตชิ้นส่วนอิเล็กทรอนิกส์และระบบจัดการพลังงานชั้นนำระดับโลก โดยเฉพาะระบบไฟฟ้ายานยนต์ EV และเซิร์ฟเวอร์ AI Data Center",
    lo: "ບໍລິສັດ ເດວຕ້າ ອີເລັກໂທຣນິກສ໌ (ປະເທດໄທ) ຈຳກັດ (ມະຫາຊົນ) ຜູ້ຜະລິດຊິ້ນສ່ວນເອເລັກໂຕຣນິກ ແລະ ລະບົບຈັດການພະລັງງານສຳລັບລົດໄຟຟ້າ ແລະ AI Data Center.",
    en: "Delta Electronics (Thailand) Public Company Limited is a leading manufacturer of power management and thermal solutions for EVs and AI data centers.",
  },
  "VCB.VN": {
    zh: "越南外贸股份商业银行（Vietcombank）是越南规模最大、盈利能力最强的领先商业银行，为个人与企业提供全方位国际结算、贸易融资及数字金融服务。",
    th: "ธนาคารพาณิชย์การค้าต่างประเทศเวียดนาม (Vietcombank) สถาบันการเงินและธนาคารพาณิชย์อันดับ 1 ของเวียดนาม ให้บริการธุรกรรมการเงินและการค้าระหว่างประเทศครบวงจร",
    lo: "ທະນາຄານການຄ້າຕ່າງປະເທດຫວຽດນາມ (Vietcombank) ທະນາຄານພານິດອັນດັບ 1 ຂອງຫວຽດນາມ ໃຫ້ບໍລິການທາງການເງິນຄົບວົງຈອນ.",
    en: "Joint Stock Commercial Bank for Foreign Trade of Vietnam (Vietcombank) is Vietnam's premier commercial bank providing comprehensive banking and trade finance services.",
  },
  "600519.SS": {
    zh: "贵州茅台酒股份有限公司是中国大曲酱香型白酒的鼻祖与典型代表，享有“国酒”之美誉，拥有卓越的品牌护城河与全球烈酒市场最高的企业市值。",
    th: "กุ้ยโจว เหมาไถ (Kweichow Moutai) ผู้ผลิตสุราขาวเหมาไถอันดับ 1 ของจีน เป็นแบรนด์หรูระดับตำนานที่มีมูลค่าตลาดและอัตรากำไรสูงที่สุดในอุตสาหกรรมสุราโลก",
    lo: "ກຸ້ຍໂຈວ ເໝົາໄຖ (Kweichow Moutai) ຜູ້ຜະລິດເຫຼົ້າຂາວເໝົາໄຖອັນດັບ 1 ຂອງຈີນ ເປັນແບຣນລະດັບຕຳນານທີ່ມີມູນຄ່າສູງ.",
    en: "Kweichow Moutai Co., Ltd. produces premium Chinese Baijiu liquor, recognized globally as the world's most valuable spirits brand.",
  },
  "7203.T": {
    zh: "丰田汽车公司（Toyota Motor Corporation）是全球最大的跨国汽车制造商之一，旗下拥有丰田（Toyota）与雷克萨斯（Lexus）品牌，在油电混合动力、氢能技术与纯电领域均处于全球领导地位。",
    th: "บริษัท โตโยต้า มอเตอร์ คอร์ปอเรชัน หนึ่งในผู้ผลิตรถยนต์รายใหญ่ที่สุดในโลก เจ้าของแบรนด์ Toyota และ Lexus ผู้นำด้านยานยนต์ไฮบริดและนวัตกรรมพลังงานสะอาด",
    lo: "ບໍລິສັດ ໂຕໂຢຕ້າ ມໍເຕີ ຄໍປໍເຣຊັນ ຜູ້ຜະລິດລົດຍົນລາຍໃຫຍ່ທີ່ສຸດໃນໂລກ ເຈົ້າຂອງແບຣນ Toyota ແລະ Lexus.",
    en: "Toyota Motor Corporation is a multinational automotive manufacturer that produces vehicles under the Toyota and Lexus marques, leading in hybrid and mobility technology.",
  },
  AAPL: {
    zh: "苹果公司（Apple Inc.）是全球领先的科技巨头，设计、制造并销售智能手机（iPhone）、个人电脑（Mac）、平板电脑（iPad）及可穿戴设备，并拥有繁荣的App Store、iCloud与订阅服务生态系统。",
    th: "บริษัท แอปเปิล (Apple Inc.) ผู้นำเทคโนโลยีระดับโลก ผู้ออกแบบและผลิต iPhone, Mac, iPad และระบบนิเวศบริการดิจิทัลชั้นนำระดับโลก",
    lo: "ບໍລິສັດ ແອັບເປີ້ນ (Apple Inc.) ຜູ້ນຳເຕັກໂນໂລຢີລະດັບໂລກ ຜູ້ຜະລິດ iPhone, Mac, iPad ແລະ ລະບົບນິເວດດິຈິຕອນ.",
    en: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and sells a variety of related services.",
  },
  NVDA: {
    zh: "英伟达公司（NVIDIA Corporation）是全球AI算力基础设施与GPU计算领域的开创者与领导者，其数据中心AI芯片、加速计算平台及Omniverse引领着全球人工智能革命。",
    th: "บริษัท อินวิเดีย (NVIDIA) ผู้นำระดับโลกด้านชิปประมวลผลกราฟิก (GPU) และโครงสร้างพื้นฐานระบบประมวลผลปัญญาประดิษฐ์ (AI Computing Platform)",
    lo: "ບໍລິສັດ ອິນວິເດຍ (NVIDIA) ຜູ້ນຳລະດັບໂລກດ້ານຊິບ GPU ແລະ ລະບົບປະມວນຜົນປັນຍາປະດິດ (AI).",
    en: "NVIDIA Corporation is the pioneer and market leader in GPU-accelerated computing and artificial intelligence chips worldwide.",
  },
};

export function getLocalizedDescription(symbol: string, rawDesc: string | undefined, lang: Language): string {
  const custom = COMPANY_DESCRIPTIONS[symbol] || COMPANY_DESCRIPTIONS[symbol.replace(/^LSX:/i, "")];
  if (custom && custom[lang]) {
    return custom[lang];
  }
  return rawDesc || "";
}

export function getLocalizedBreakdownItem(
  item: { name: string; signal: string; status: string; desc: string },
  lang: Language
): { name: string; status: string; desc: string } {
  if (lang === "lo") {
    return { name: item.name, status: item.status, desc: item.desc };
  }

  let name = item.name;
  let status = item.status;
  let desc = item.desc;

  if (item.name.includes("MA20")) {
    if (lang === "th") {
      name = "เส้นค่าเฉลี่ย MA20";
      status = item.signal === "BUY" ? "ราคายืนเหนือเส้นค่าเฉลี่ย" : "ราคาหลุดต่ำกว่าเส้นค่าเฉลี่ย";
      desc = item.signal === "BUY" ? "ราคาปัจจุบันยืนเหนือเส้น MA20 สะท้อนแนวโน้มขาขึ้นระยะสั้น" : "ราคาปัจจุบันหลุดต่ำกว่าเส้น MA20 บ่งชี้แรงกดดันฝั่งขาย";
    } else if (lang === "zh") {
      name = "MA20 移动均线";
      status = item.signal === "BUY" ? "价格站稳均线上方" : "价格跌破均线支撑";
      desc = item.signal === "BUY" ? "当前价格运行于MA20均线上方，反映短期多头上升格局" : "当前价格跌破MA20均线支撑，面临短期空头压制";
    } else {
      name = "MA20 Moving Average";
      status = item.signal === "BUY" ? "Price above MA20" : "Price below MA20";
      desc = item.signal === "BUY" ? "Price trades above MA20 indicating short-term bullish momentum" : "Price trades below MA20 indicating downward pressure";
    }
  } else if (item.name.includes("RSI")) {
    if (lang === "th") {
      name = "RSI (14)";
      desc = item.signal.includes("BUY") ? "เกิดภาวะขายมากเกินไป (Oversold) มีโอกาสฟื้นตัวกลับขึ้นมา" : "เกิดภาวะซื้อมากเกินไป (Overbought) หรือโมเมนตัมชะลอตัว";
    } else if (lang === "zh") {
      name = "RSI 相对强弱指标 (14)";
      desc = item.signal.includes("BUY") ? "指标进入超卖区间或处于多头强势区，存在超跌反弹或动能延续机会" : "指标进入超买区间或空头承压区，需防范获利盘回吐压力";
    } else {
      name = "RSI (14)";
      desc = item.signal.includes("BUY") ? "RSI in oversold or bullish momentum territory, indicating upward potential" : "RSI in overbought or bearish territory, warning of selling pressure";
    }
  } else if (item.name.includes("MACD")) {
    if (lang === "th") {
      name = "MACD (12, 26, 9)";
      status = item.signal === "BUY" ? "Golden Cross (ตัดขึ้น)" : item.signal === "SELL" ? "Death Cross (ตัดลง)" : "แกว่งตัวในกรอบ";
      desc = item.signal === "BUY" ? "เส้น MACD ตัดเส้น Signal ขึ้น เป็นสัญญาณแรงส่งขาขึ้นชัดเจน" : item.signal === "SELL" ? "เส้น MACD ตัดเส้น Signal ลง เป็นสัญญาณเตือนระวังแรงขาย" : "MACD เคลื่อนที่ใกล้เส้นสัญญาณ รอเลือกทิศทาง";
    } else if (lang === "zh") {
      name = "MACD 平滑异同移动平均线";
      status = item.signal === "BUY" ? "金叉向上突破 (Golden Cross)" : item.signal === "SELL" ? "死叉拐头向下 (Death Cross)" : "粘合震荡整理";
      desc = item.signal === "BUY" ? "快线自下而上有效穿越慢线形成金叉，释放明确多头上攻信号" : item.signal === "SELL" ? "快线自上而下拐头跌破慢线形成死叉，警惕短期回调抛压" : "快慢线粘合缠绕，等待放量选择突破方向";
    } else {
      name = "MACD (12, 26, 9)";
      status = item.signal === "BUY" ? "Golden Cross" : item.signal === "SELL" ? "Death Cross" : "Consolidating";
      desc = item.signal === "BUY" ? "MACD crossed above Signal line, signaling strong bullish momentum" : item.signal === "SELL" ? "MACD crossed below Signal line, warning of selling momentum" : "MACD consolidating around signal line";
    }
  } else if (item.name.includes("Bollinger")) {
    if (lang === "th") {
      name = "Bollinger Bands";
      status = item.signal === "BUY" ? "ใกล้กรอบล่าง (Support)" : "ใกล้กรอบบน (Resistance)";
      desc = item.signal === "BUY" ? "ราคาลงมาใกล้เส้นกรอบล่าง Bollinger Bands ซึ่งเป็นแนวรับที่มีโอกาสดีดตัว" : "ราคาขึ้นมาติดเส้นกรอบบน Bollinger Bands อาจติดแนวต้านและชะลอตัว";
    } else if (lang === "zh") {
      name = "布林带 (Bollinger Bands)";
      status = item.signal === "BUY" ? "触及下轨支撑 (Support)" : "承压上轨阻力 (Resistance)";
      desc = item.signal === "BUY" ? "价格回踩至布林线下轨支撑线附近，存在技术性超跌反弹动能" : "价格上攻至布林线上轨阻力区域，可能面临阻力而减速整理";
    } else {
      name = "Bollinger Bands";
      status = item.signal === "BUY" ? "Near Lower Band (Support)" : "Near Upper Band (Resistance)";
      desc = item.signal === "BUY" ? "Price tests lower Bollinger Band, acting as support with rebound potential" : "Price tests upper Bollinger Band, facing resistance";
    }
  }

  return { name, status, desc };
}
