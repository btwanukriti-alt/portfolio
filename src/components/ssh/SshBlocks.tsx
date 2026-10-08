// SSH client bento blocks: parts of the dark UI rebuilt as components, so each card shows one idea.

const RX = [3, 3, 3, 3, 4, 4, 4, 5, 5, 4, 6, 6, 7, 4, 4, 6, 10, 10, 4]
const TX = [3, 3, 3, 3, 3, 4, 4, 5, 5, 4, 4, 6, 6, 7, 4, 4, 6, 10, 10, 4]

function Rate({ label, value, bars, color }: { label: string; value: string; bars: number[]; color: string }) {
  return (
    <div className="flex flex-1 flex-col rounded-[14px] bg-white/[0.04] p-4 ring-1 ring-white/[0.07]">
      <p className="m-0 text-[13px] text-white/60">{label}</p>
      <p className="m-0 mt-2 text-[30px] leading-none font-semibold" style={{ color }}>
        {value}
        <span className="ml-1 text-[13px] font-normal text-white/55">MB/s</span>
      </p>
      <div className="mt-5 flex h-[64px] items-end gap-[3px]">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-[2px]" style={{ height: `${h * 10}%`, background: color }} />
        ))}
      </div>
    </div>
  )
}

function Network() {
  return (
    <div className="flex h-full flex-col justify-center text-white">
      <p className="m-0 text-[15px] font-medium">Network · eth0</p>
      <div className="mt-4 flex gap-3">
        <Rate label="Download" value="1.1" bars={RX} color="#A78BFA" />
        <Rate label="Upload" value="1.6" bars={TX} color="#34D399" />
      </div>
    </div>
  )
}

function HostCard() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-[340px] rounded-[16px] bg-[#16161F] text-white ring-1 ring-white/[0.08]">
        <div className="flex items-center gap-4 p-5">
          <span className="grid size-[52px] place-items-center rounded-[12px] bg-white/[0.05]">
            <span className="size-[26px] rounded-full border-[5px] border-[#E95420]" />
          </span>
          <div>
            <p className="m-0 flex items-center gap-2 text-[17px] font-medium">
              API Gateway <span className="size-[8px] rounded-full bg-[#34D399]" />
            </p>
            <p className="m-0 mt-1 text-[14px] text-white/50">192.168.1.100</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-4">
          <span className="text-[13px] text-white/50">Stats · Terminal · Files</span>
          <span className="rounded-[8px] bg-[#7C5CFF] px-4 py-[7px] text-[13px] font-medium">Connect</span>
        </div>
      </div>
    </div>
  )
}

function Autocomplete() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 text-white">
      <div className="flex items-center justify-between rounded-[14px] bg-white/[0.04] px-5 py-4 ring-1 ring-white/[0.07]">
        <span className="text-[15px]">✦ Autocomplete commands</span>
        <span className="flex h-[24px] w-[44px] items-center justify-end rounded-full bg-[linear-gradient(135deg,#22D3EE,#3B82F6)] px-[3px]">
          <span className="size-[18px] rounded-full bg-white" />
        </span>
      </div>
      <div className="rounded-[14px] bg-white/[0.04] px-5 py-4 font-mono text-[13px] text-white/70 ring-1 ring-white/[0.07]">
        <span className="text-[#5EEAD4]">$</span> docker ps <span className="text-white/30">-a --format</span>
      </div>
      <span className="self-end rounded-full bg-[linear-gradient(135deg,#22D3EE,#3B82F6)] px-5 py-[10px] text-[14px] font-medium">✦ Ask AI</span>
    </div>
  )
}

export const SSH_BLOCKS: Record<string, () => React.JSX.Element> = {
  'ssh-network': Network,
  'ssh-host-card': HostCard,
  'ssh-autocomplete': Autocomplete,
}
