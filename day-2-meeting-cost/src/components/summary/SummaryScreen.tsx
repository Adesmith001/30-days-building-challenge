import {
  Download,
  Share2,
} from "lucide-react";
import { useRef } from "react";

import { useReceiptExport } from "../../hooks/useReceiptExport";

import type {
  EfficiencyAnswers,
  MeetingRecord,
} from "../../types/meeting";

import { Button } from "../ui/Button";
import { EfficiencyCard } from "./EfficiencyCard";
import { HistoryPreview } from "./HistoryPreview";
import { MeetingReceipt } from "./MeetingReceipt";

interface Props {
  meeting: MeetingRecord;
  history: MeetingRecord[];
  onEfficiencyChange: (
    answers: EfficiencyAnswers,
  ) => void;
  onNewMeeting: () => void;
}

export function SummaryScreen({
  meeting,
  history,
  onEfficiencyChange,
  onNewMeeting,
}: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const { save, share } = useReceiptExport(
    receiptRef,
    `meeting-cost-${meeting.id}.png`,
  );

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f7] px-4 py-8 [background-image:linear-gradient(rgba(0,0,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.04)_1px,transparent_1px)] [background-size:46px_46px] md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[430px_1fr]">
        <MeetingReceipt
          ref={receiptRef}
          meeting={meeting}
        />

        <div className="space-y-8">
          <EfficiencyCard
            answers={meeting.efficiency}
            onChange={onEfficiencyChange}
          />

          <HistoryPreview
            history={history}
            current={meeting}
          />

          <div className="grid grid-cols-2 gap-3 md:flex md:justify-end">
            <Button onClick={save}>
              <Download size={14} />
              SAVE RECEIPT
            </Button>

            <Button
              variant="primary"
              onClick={share}
            >
              <Share2 size={14} />
              SHARE
            </Button>

            <Button
              className="col-span-2"
              onClick={onNewMeeting}
            >
              NEW MEETING
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}