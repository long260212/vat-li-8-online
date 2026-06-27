import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Droplets, Gauge, HelpCircle, Lightbulb, RotateCcw, Scale, Thermometer, Waves, Zap } from 'lucide-react';

type LabId = 'pressure-solid' | 'pressure-liquid' | 'archimedes' | 'heat-balance';

interface LabInfo {
  id: LabId;
  title: string;
  chapter: string;
  icon: string;
  short: string;
}

const LABS: LabInfo[] = [
  {
    id: 'pressure-solid',
    title: 'Áp suất chất rắn',
    chapter: 'Cơ học',
    icon: '🧱',
    short: 'Thay đổi lực ép và diện tích tiếp xúc để quan sát áp suất.'
  },
  {
    id: 'pressure-liquid',
    title: 'Áp suất chất lỏng',
    chapter: 'Cơ học',
    icon: '🌊',
    short: 'Khảo sát độ sâu và trọng lượng riêng của chất lỏng.'
  },
  {
    id: 'archimedes',
    title: 'Lực đẩy Ác-si-mét',
    chapter: 'Cơ học',
    icon: '🚢',
    short: 'Điều chỉnh thể tích phần chìm để dự đoán vật nổi hay chìm.'
  },
  {
    id: 'heat-balance',
    title: 'Cân bằng nhiệt',
    chapter: 'Nhiệt học',
    icon: '🔥',
    short: 'Trộn hai lượng nước để tìm nhiệt độ cân bằng.'
  }
];

const LIQUIDS = [
  { name: 'Dầu ăn', d: 8000, color: 'bg-amber-400' },
  { name: 'Nước', d: 10000, color: 'bg-blue-500' },
  { name: 'Nước muối', d: 10300, color: 'bg-cyan-500' },
  { name: 'Thủy ngân', d: 136000, color: 'bg-slate-500' }
];

function formatNumber(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : Math.min(1, fractionDigits)
  }).format(value);
}

function ResultCard({ label, value, unit, hint }: { label: string; value: string; unit?: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-black text-slate-850 dark:text-white">{value}</span>
        {unit && <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{unit}</span>}
      </div>
      {hint && <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange, help }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  help?: string;
}) {
  return (
    <label className="block rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{label}</span>
          {help && <p className="mt-1 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">{help}</p>}
        </div>
        <span className="shrink-0 rounded-xl bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-black text-blue-700 dark:text-blue-300 border border-slate-100 dark:border-slate-800">
          {formatNumber(value, 2)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-600 cursor-pointer"
      />
    </label>
  );
}

function SolidPressureLab() {
  const [force, setForce] = useState(500);
  const [areaCm2, setAreaCm2] = useState(250);
  const areaM2 = areaCm2 / 10000;
  const pressure = force / areaM2;
  const blockWidth = Math.max(54, Math.min(190, areaCm2 / 2.4));
  const blockHeight = Math.max(42, Math.min(126, force / 9));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <SliderRow label="Áp lực F" value={force} min={100} max={1000} step={50} unit="N" onChange={setForce} help="Lực ép vuông góc lên mặt bị ép." />
        <SliderRow label="Diện tích tiếp xúc S" value={areaCm2} min={50} max={600} step={10} unit="cm²" onChange={setAreaCm2} help="S càng nhỏ thì cùng một lực ép sẽ gây áp suất càng lớn." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultCard label="Áp suất" value={formatNumber(pressure, 0)} unit="Pa" hint="p = F / S, trong đó S phải đổi về m²." />
          <ResultCard label="Diện tích đã đổi" value={formatNumber(areaM2, 4)} unit="m²" hint="1 cm² = 0,0001 m²." />
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-b from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-950/30 p-5 min-h-[360px] flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Mô phỏng bề mặt bị ép</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Khối càng hẹp, vùng chịu lực càng nhỏ, áp suất càng tăng.</p>
          </div>
          <Gauge size={26} className="text-blue-600 dark:text-blue-400" />
        </div>

        <div className="flex-1 flex items-end justify-center py-8">
          <div className="relative flex flex-col items-center">
            <div
              className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-xl shadow-blue-500/20 border border-white/30 transition-all duration-300 flex items-center justify-center text-white text-xs font-black"
              style={{ width: `${blockWidth}px`, height: `${blockHeight}px` }}
            >
              F = {force}N
            </div>
            <div className="h-3 w-3 bg-blue-600 rotate-45 -mt-1" />
            <div className="h-8 w-[2px] bg-blue-600" />
            <div className="h-4 rounded-full bg-slate-300 dark:bg-slate-700 transition-all duration-300" style={{ width: `${Math.max(70, blockWidth + 40)}px` }} />
            <div className="mt-1 h-6 rounded-b-3xl bg-slate-200 dark:bg-slate-800 border-x border-b border-slate-300 dark:border-slate-700" style={{ width: `${Math.max(110, blockWidth + 100)}px` }} />
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <strong className="text-slate-800 dark:text-white">Kết luận:</strong> Muốn tăng áp suất thì tăng F hoặc giảm S. Đây là lý do dao, đinh, mũi khoan thường có phần tiếp xúc rất nhỏ.
        </div>
      </div>
    </div>
  );
}

function LiquidPressureLab() {
  const [depth, setDepth] = useState(2.5);
  const [liquidIndex, setLiquidIndex] = useState(1);
  const liquid = LIQUIDS[liquidIndex];
  const pressure = liquid.d * depth;
  const markerTop = Math.max(18, Math.min(82, 12 + depth * 12));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <SliderRow label="Độ sâu h" value={depth} min={0.2} max={6} step={0.1} unit="m" onChange={setDepth} help="Đo từ mặt thoáng chất lỏng đến điểm đang xét." />
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4">
          <div className="mb-2 text-xs font-extrabold text-slate-700 dark:text-slate-200">Chất lỏng</div>
          <div className="grid grid-cols-2 gap-2">
            {LIQUIDS.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setLiquidIndex(index)}
                className={`rounded-xl px-3 py-2 text-xs font-bold border transition-all cursor-pointer ${liquidIndex === index ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-blue-300'}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultCard label="Áp suất chất lỏng" value={formatNumber(pressure, 0)} unit="Pa" hint="p = d × h." />
          <ResultCard label="Trọng lượng riêng" value={formatNumber(liquid.d, 0)} unit="N/m³" hint="Chất lỏng có d lớn tạo áp suất lớn hơn ở cùng độ sâu." />
        </div>
      </div>

      <div className="rounded-3xl border border-cyan-100 dark:border-cyan-900/40 bg-gradient-to-b from-cyan-50 to-slate-50 dark:from-cyan-950/20 dark:to-slate-950/30 p-5 min-h-[360px] overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Bình chất lỏng</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Điểm đo càng sâu thì áp suất càng lớn.</p>
          </div>
          <Waves size={28} className="text-cyan-600 dark:text-cyan-400" />
        </div>

        <div className="relative mx-auto h-64 max-w-[270px] rounded-b-[36px] rounded-t-xl border-4 border-slate-300/70 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-[88%] bg-gradient-to-b from-cyan-300/60 to-blue-600/70 dark:from-cyan-500/30 dark:to-blue-800/60" />
          <div className="absolute inset-x-0 top-[12%] h-2 bg-white/70 dark:bg-cyan-200/30 rounded-full" />
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500 transition-all duration-300" style={{ top: `${markerTop}%` }}>
            <span className="absolute -top-3 right-3 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">h = {formatNumber(depth, 1)}m</span>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-white/90 dark:bg-slate-900/85 border border-slate-100 dark:border-slate-800 px-3 py-2 text-center text-xs font-black text-slate-700 dark:text-slate-200">
            {liquid.name}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <strong className="text-slate-800 dark:text-white">Kết luận:</strong> Áp suất chất lỏng phụ thuộc vào độ sâu và trọng lượng riêng, không phụ thuộc trực tiếp vào hình dạng bình chứa.
        </div>
      </div>
    </div>
  );
}

function ArchimedesLab() {
  const [volumeDm3, setVolumeDm3] = useState(3);
  const [submergedPercent, setSubmergedPercent] = useState(70);
  const [weight, setWeight] = useState(22);
  const [liquidIndex, setLiquidIndex] = useState(1);
  const liquid = LIQUIDS[liquidIndex];
  const submergedVolumeM3 = (volumeDm3 / 1000) * (submergedPercent / 100);
  const buoyantForce = liquid.d * submergedVolumeM3;
  const state = buoyantForce > weight + 1 ? 'Có xu hướng nổi lên' : buoyantForce < weight - 1 ? 'Có xu hướng chìm xuống' : 'Gần cân bằng/lơ lửng';
  const objectTop = 100 - submergedPercent;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <SliderRow label="Thể tích vật" value={volumeDm3} min={0.5} max={8} step={0.1} unit="dm³" onChange={setVolumeDm3} help="1 dm³ = 0,001 m³." />
        <SliderRow label="Phần thể tích bị chìm" value={submergedPercent} min={10} max={100} step={5} unit="%" onChange={setSubmergedPercent} help="Trong công thức chỉ dùng thể tích phần chìm trong chất lỏng." />
        <SliderRow label="Trọng lượng vật P" value={weight} min={2} max={80} step={1} unit="N" onChange={setWeight} help="So sánh P với lực đẩy Ác-si-mét để dự đoán trạng thái." />
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4">
          <div className="mb-2 text-xs font-extrabold text-slate-700 dark:text-slate-200">Chất lỏng</div>
          <div className="grid grid-cols-2 gap-2">
            {LIQUIDS.slice(0, 3).map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setLiquidIndex(index)}
                className={`rounded-xl px-3 py-2 text-xs font-bold border transition-all cursor-pointer ${liquidIndex === index ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-teal-300'}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultCard label="Lực đẩy Ác-si-mét" value={formatNumber(buoyantForce, 2)} unit="N" hint="F_A = d × V_chìm." />
          <ResultCard label="Dự đoán trạng thái" value={state} hint="Vật cân bằng khi F_A xấp xỉ P." />
        </div>
      </div>

      <div className="rounded-3xl border border-teal-100 dark:border-teal-900/40 bg-gradient-to-b from-teal-50 to-slate-50 dark:from-teal-950/20 dark:to-slate-950/30 p-5 min-h-[420px] overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Vật trong chất lỏng</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Mũi tên lên biểu diễn lực đẩy, mũi tên xuống biểu diễn trọng lượng.</p>
          </div>
          <Scale size={28} className="text-teal-600 dark:text-teal-400" />
        </div>

        <div className="relative mx-auto h-72 max-w-[300px] rounded-3xl border-4 border-slate-300/70 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-[82%] bg-gradient-to-b from-teal-300/50 to-blue-600/60 dark:from-teal-500/25 dark:to-blue-800/55" />
          <div className="absolute inset-x-0 top-[18%] h-2 bg-white/70 dark:bg-teal-200/30 rounded-full" />
          <div className="absolute left-1/2 w-24 h-24 -translate-x-1/2 rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-xl border border-white/40 transition-all duration-300 flex items-center justify-center text-white text-xs font-black" style={{ top: `${Math.max(18, Math.min(70, objectTop + 18))}%` }}>
            Vật
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-10 flex flex-col items-center text-rose-600 font-black text-[10px]">
            <span>P</span>
            <div className="w-[2px] h-16 bg-rose-500" />
            <ArrowRight size={18} className="rotate-90 -mt-1 fill-rose-500" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center text-teal-700 dark:text-teal-300 font-black text-[10px]">
            <ArrowRight size={18} className="-rotate-90 fill-teal-600" />
            <div className="w-[2px] h-16 bg-teal-600" />
            <span>F_A</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <strong className="text-slate-800 dark:text-white">Kết luận:</strong> Lực đẩy tăng khi phần thể tích chìm tăng hoặc chất lỏng có trọng lượng riêng lớn hơn.
        </div>
      </div>
    </div>
  );
}

function HeatBalanceLab() {
  const [hotMass, setHotMass] = useState(0.5);
  const [hotTemp, setHotTemp] = useState(80);
  const [coldMass, setColdMass] = useState(1);
  const [coldTemp, setColdTemp] = useState(25);
  const finalTemp = useMemo(() => {
    return (hotMass * hotTemp + coldMass * coldTemp) / (hotMass + coldMass);
  }, [hotMass, hotTemp, coldMass, coldTemp]);
  const qHot = hotMass * 4200 * (hotTemp - finalTemp);
  const qCold = coldMass * 4200 * (finalTemp - coldTemp);
  const hotHeight = Math.max(35, Math.min(145, hotMass * 80));
  const coldHeight = Math.max(35, Math.min(145, coldMass * 80));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SliderRow label="Khối lượng nước nóng" value={hotMass} min={0.1} max={2} step={0.1} unit="kg" onChange={setHotMass} />
          <SliderRow label="Nhiệt độ nước nóng" value={hotTemp} min={35} max={100} step={1} unit="°C" onChange={setHotTemp} />
          <SliderRow label="Khối lượng nước lạnh" value={coldMass} min={0.1} max={2} step={0.1} unit="kg" onChange={setColdMass} />
          <SliderRow label="Nhiệt độ nước lạnh" value={coldTemp} min={0} max={34} step={1} unit="°C" onChange={setColdTemp} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultCard label="Nhiệt độ cân bằng" value={formatNumber(finalTemp, 1)} unit="°C" hint="Giả sử không thất thoát nhiệt." />
          <ResultCard label="Q tỏa" value={formatNumber(qHot, 0)} unit="J" hint="Nước nóng tỏa nhiệt." />
          <ResultCard label="Q thu" value={formatNumber(qCold, 0)} unit="J" hint="Nước lạnh thu nhiệt." />
        </div>
      </div>

      <div className="rounded-3xl border border-orange-100 dark:border-orange-900/40 bg-gradient-to-b from-orange-50 to-slate-50 dark:from-orange-950/20 dark:to-slate-950/30 p-5 min-h-[420px] overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Trao đổi nhiệt</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Nước nóng tỏa nhiệt, nước lạnh thu nhiệt đến khi cùng nhiệt độ.</p>
          </div>
          <Thermometer size={28} className="text-orange-600 dark:text-orange-400" />
        </div>

        <div className="flex items-end justify-center gap-6 min-h-[250px]">
          <div className="text-center space-y-2">
            <div className="mx-auto w-20 rounded-t-3xl rounded-b-xl border-4 border-orange-200 dark:border-orange-900/60 bg-white dark:bg-slate-900 flex items-end overflow-hidden h-44">
              <div className="w-full bg-gradient-to-t from-orange-500 to-rose-400 transition-all duration-300" style={{ height: `${hotHeight}px` }} />
            </div>
            <div className="text-xs font-black text-orange-700 dark:text-orange-300">{formatNumber(hotTemp, 0)}°C</div>
          </div>

          <div className="flex flex-col items-center gap-2 pb-16">
            <Zap size={24} className="text-amber-500 fill-amber-400" />
            <ArrowRight size={32} className="text-slate-400" />
            <div className="rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1 text-[11px] font-black text-slate-700 dark:text-slate-200">
              {formatNumber(finalTemp, 1)}°C
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="mx-auto w-20 rounded-t-3xl rounded-b-xl border-4 border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 flex items-end overflow-hidden h-44">
              <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-300 transition-all duration-300" style={{ height: `${coldHeight}px` }} />
            </div>
            <div className="text-xs font-black text-blue-700 dark:text-blue-300">{formatNumber(coldTemp, 0)}°C</div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <strong className="text-slate-800 dark:text-white">Kết luận:</strong> Trong mô hình lí tưởng, nhiệt lượng vật nóng tỏa ra bằng nhiệt lượng vật lạnh thu vào: Q_tỏa = Q_thu.
        </div>
      </div>
    </div>
  );
}

export default function VirtualLab() {
  const [activeLab, setActiveLab] = useState<LabId>('pressure-solid');
  const [resetKey, setResetKey] = useState(0);
  const active = LABS.find((lab) => lab.id === activeLab) || LABS[0];

  const renderLab = () => {
    switch (activeLab) {
      case 'pressure-liquid':
        return <LiquidPressureLab />;
      case 'archimedes':
        return <ArchimedesLab />;
      case 'heat-balance':
        return <HeatBalanceLab />;
      default:
        return <SolidPressureLab />;
    }
  };

  return (
    <div id="virtual-lab-view" className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-950 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 opacity-10">
          <Droplets size={260} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-100">
            <Lightbulb size={13} className="text-amber-300 fill-amber-300" /> Phòng thí nghiệm ảo Vật lí 8
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Thử - Quan sát - Rút kết luận</h1>
          <p className="text-sm md:text-base leading-relaxed text-cyan-50/90">
            Học sinh có thể kéo thanh điều chỉnh số liệu, nhìn kết quả thay đổi ngay lập tức và tự kiểm chứng công thức. Đây là mô phỏng học tập, không thay thế hoàn toàn thí nghiệm thật trong lớp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {LABS.map((lab) => (
          <button
            key={lab.id}
            type="button"
            onClick={() => setActiveLab(lab.id)}
            className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${activeLab === lab.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-900'}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{lab.icon}</div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">{lab.chapter}</div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{lab.title}</h3>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{lab.short}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Đang thực hành</div>
            <h2 className="text-2xl font-black text-slate-850 dark:text-white">{active.icon} {active.title}</h2>
          </div>
          <button
            type="button"
            onClick={() => setResetKey((prev) => prev + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RotateCcw size={14} /> Làm lại thông số
          </button>
        </div>
        <div key={`${activeLab}-${resetKey}`}>
          {renderLab()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/20 p-5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black text-sm">
            <CheckCircle2 size={18} /> Gợi ý tổ chức lớp
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Cho học sinh dự đoán trước, kéo thông số kiểm chứng, sau đó viết kết luận bằng công thức.</p>
        </div>
        <div className="rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 p-5">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-black text-sm">
            <HelpCircle size={18} /> Câu hỏi nhanh
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Đại lượng nào tăng? Đại lượng nào giảm? Kết quả có phù hợp công thức không?</p>
        </div>
        <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 p-5">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-black text-sm">
            <BookOpen size={18} /> Lưu ý khoa học
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Các mô phỏng đã bỏ qua sai số, ma sát và thất thoát nhiệt để học sinh tập trung vào quan hệ chính.</p>
        </div>
      </div>
    </div>
  );
}
