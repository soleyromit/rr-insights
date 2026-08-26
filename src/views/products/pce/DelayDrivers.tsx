// views/products/pce/DelayDrivers.tsx — PCE Delay Drivers (v19.15). Built to
// replace a standalone leadership report (Aug 19, 2026) with the same thesis
// and the same specificity, re-derived fresh rather than copied: PCE has been
// called out for delay twice; the record — tracker, Outlook, Teams, and this
// corpus's own Aug 24 sync — points to review latency and reviewer churn on
// the other side of the table, not design throughput. One thing that earlier
// report had is absent here: GitHub-derived counts — the GitHub MCP connector
// failed authentication this session, so the change-request floor is carried
// forward, not re-run (named in the closing note, not silently dropped).
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Timestamp } from '@astryxdesign/core/Timestamp';
import { ChatMessageList, ChatMessage, ChatMessageBubble, ChatMessageMetadata, ChatSystemMessage } from '@astryxdesign/core/Chat';
import { Avatar } from '@astryxdesign/core/Avatar';
import { AvatarStatusDot } from '@astryxdesign/core/Avatar';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { Icon } from '@astryxdesign/core/Icon';
import { StatTile, StatTileRow } from '../../../components/story/StatTile';
import { ColumnBarChart } from '../../../components/charts/ColumnBarChart';
import { StackedBarChart } from '../../../components/charts/StackedBarChart';
import { Fig } from '../../../components/charts/Fig';
import { SpecSection } from '../spec/SpecSection';
import {
  DELAY_TIMELINE, FEATURE_STATUS, T129_ESCALATION, DEADLINE_ROWS,
  CHANGE_REQUEST_FLOOR, ATTENDANCE, ATTENDANCE_NOTE, CHAT_THREAD, CLOSING_NOTE,
} from '../../../data/pceDelayDrivers';
import type { FeatureStatusRow, DeadlineRow, DelayTimelineEvent, ChatMessage as ChatMessageDatum } from '../../../data/pceDelayDrivers';

/** Clusters consecutive same-sender chat entries into ChatMessage turns; each system entry is its own turn. */
function groupChatTurns(thread: ChatMessageDatum[]): ChatMessageDatum[][] {
  const turns: ChatMessageDatum[][] = [];
  for (const m of thread) {
    const last = turns[turns.length - 1];
    if (m.sender !== 'system' && last && last[0].sender === m.sender) last.push(m);
    else turns.push([m]);
  }
  return turns;
}

const VERIFICATION_BADGE: Record<DelayTimelineEvent['verification'], { variant: 'success' | 'info' | 'neutral'; label: string }> = {
  reverified: { variant: 'success', label: 'reverified Aug 26' },
  new: { variant: 'info', label: 'new Aug 26' },
  'carried-forward': { variant: 'neutral', label: 'carried forward' },
};

const FLAG_BADGE: Record<FeatureStatusRow['flag'], { variant: 'success' | 'error' | 'warning' | 'neutral'; label: string }> = {
  'on-track': { variant: 'success', label: 'On track' },
  'awaiting-designs': { variant: 'error', label: 'Awaiting designs' },
  'to-be-groomed': { variant: 'warning', label: 'To be groomed' },
  open: { variant: 'neutral', label: 'Open' },
};

const FLAG_TONE: Record<FeatureStatusRow['flag'], 'positive' | 'negative' | 'warning' | 'neutral'> = {
  'on-track': 'positive',
  'awaiting-designs': 'negative',
  'to-be-groomed': 'warning',
  open: 'neutral',
};

export function DelayDrivers() {
  const worst = FEATURE_STATUS.reduce((a, b) => (b.overallPct < a.overallPct ? b : a));
  const staleDeadlines = DEADLINE_ROWS.filter((d) => d.stale).length;
  const vishal = ATTENDANCE.find((a) => a.key === 'vishal')!;
  const vishalPct = Math.round((vishal.accepted / vishal.total) * 100);

  return (
    <VStack gap={6}>
      <SpecSection
        title="Called out for delay, twice. The record still points the other way."
        sub="Re-pulled live Aug 26, 2026 — the SharePoint tracker, Outlook, Teams, and this corpus's own Aug 24 sync. Every claim below is dated and sourced; carried-forward figures are labeled, not silently repeated as fresh."
      >
        <StatTileRow>
          <StatTile icon="wrench" value={CHANGE_REQUEST_FLOOR.count} label="design change requests documented — twice independently, Aug 19 &amp; Aug 24" />
          <StatTile icon="warning" iconColor="warning" value="2" label={'confirmed "too slow" callouts — Jun 3 & Aug 12'} />
          <StatTile icon="error" iconColor="error" value={`${vishalPct}%`} label={`${vishal.person}'s sync-acceptance rate — ${vishal.accepted} of ${vishal.total} occurrences since May 12`} />
          <StatTile icon="clock" iconColor="error" value={`${worst.overallPct}%`} label={`${worst.feature} — now the single worst performer, ETA ${worst.designEta}`} />
        </StatTileRow>
      </SpecSection>

      <SpecSection
        title="The pattern, dated"
        sub="Every entry is a dated quote — a meeting note, an email, a chat message, or today's tracker re-pull. Badges mark what was reverified or found today vs. carried forward from the Aug 19 report, unverified this session."
      >
        <List density="balanced" hasDividers>
          {DELAY_TIMELINE.map((t) => {
            const b = VERIFICATION_BADGE[t.verification];
            return (
              <Item
                key={t.isoDate}
                as="li"
                label={`${t.date} — ${t.title}`}
                description={`${t.quote} — ${t.source}`}
                descriptionLines={4}
                endContent={<Badge variant={b.variant} label={b.label} />}
                align="start"
              />
            );
          })}
        </List>
      </SpecSection>

      <SpecSection
        title="Where the days actually went, by feature"
        sub="Project Summary sheet, PCE Project Tracker.xlsx — read live via Microsoft Graph today. The two features the Aug 19 report flagged as most severely blocked have since cleared; one has taken over as the worst performer."
      >
        <Fig
          title="Overall completion by feature"
          n={FEATURE_STATUS.length}
          caption="Color is status, not rank: green tracks on-track, red is design-blocked, amber is queued, gray is unscoped."
        >
          <ColumnBarChart
            data={FEATURE_STATUS.map((f) => ({ label: f.feature, value: f.overallPct, tone: FLAG_TONE[f.flag] }))}
          />
        </Fig>
        <Table<FeatureStatusRow>
          data={FEATURE_STATUS}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'feature', header: 'Feature', width: pixel(210), renderCell: (r) => (
              <VStack gap={0.5}>
                <Text type="body" weight="semibold">{r.feature}</Text>
                <Text type="supporting">{r.trackerRow}</Text>
              </VStack>
            ) },
            { key: 'designStatus', header: 'Design', width: pixel(100), renderCell: (r) => <Text type="supporting">{r.designStatus}</Text> },
            { key: 'designEta', header: 'ETA', width: pixel(100), renderCell: (r) => <Text type="supporting" hasTabularNumbers>{r.designEta}</Text> },
            { key: 'backend', header: 'Backend', width: pixel(110), renderCell: (r) => <Text type="supporting">{r.backend}</Text> },
            { key: 'frontend', header: 'Frontend', width: pixel(140), renderCell: (r) => <Text type="supporting">{r.frontend}</Text> },
            { key: 'overallPct', header: 'Overall', width: pixel(90), renderCell: (r) => <Text type="body" weight="semibold" hasTabularNumbers>{r.overallPct}%</Text> },
            { key: 'flag', header: 'Status', width: pixel(140), renderCell: (r) => { const f = FLAG_BADGE[r.flag]; return <Badge variant={f.variant} label={f.label} />; } },
            { key: 'note', header: 'Note', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.note}</Text> },
          ]}
        />
      </SpecSection>

      <SpecSection
        title="Create Survey / Distribution — directives piling up behind T129"
        sub="Blocked-directive count, cross-corroborated by two independent sources five days apart: the Aug 19 report and, separately, Himanshu's own tracking on Aug 24 (ins-process-aug24-01). As of today's tracker re-pull this feature shows Design Freeze — the blocker cleared sometime between Aug 17 and Aug 26."
      >
        <Fig
          title="Stuck directives behind T129, Jul 24 → Aug 17"
          n={T129_ESCALATION.length}
          caption="Same escalation, seen from both sides of the review — not a single, one-sided count."
        >
          <ColumnBarChart
            data={T129_ESCALATION.map((p) => ({ label: p.label, value: p.value }))}
            defaultTone="negative"
          />
        </Fig>
      </SpecSection>

      <SpecSection
        title="Product-side review attendance"
        sub="Every 'Course Eval sync up' occurrence since it started, read individually via Microsoft Graph today — 20 of 20, not sampled. Same series, same cadence, same two required attendees."
      >
        <HStack gap={5} wrap="wrap">
          {ATTENDANCE.map((a) => {
            const pct = Math.round((a.accepted / a.total) * 100);
            return (
              <HStack key={a.key} gap={2} vAlign="center">
                <Avatar
                  name={a.person}
                  size="md"
                  status={<AvatarStatusDot variant={pct >= 70 ? 'success' : 'error'} label={pct >= 70 ? 'on pace' : 'at risk'} />}
                />
                <VStack gap={0}>
                  <Text type="body" weight="semibold">{a.person}</Text>
                  <Text type="supporting">{a.role} · {pct}% accepted</Text>
                </VStack>
              </HStack>
            );
          })}
        </HStack>
        <Fig
          title="Sync response, by person"
          n={ATTENDANCE.length}
          caption="Same series, same 20 occurrences, same two required attendees — the composition is what differs."
        >
          <StackedBarChart
            data={ATTENDANCE.map((a) => ({ person: `${a.person} (${a.role})`, accepted: a.accepted, declined: a.declined, noResponse: a.noResponse }))}
            xKey="person"
            segments={[
              { key: 'accepted', label: 'Accepted', tone: 'positive' },
              { key: 'declined', label: 'Declined', tone: 'negative' },
              { key: 'noResponse', label: 'No response', tone: 'neutral' },
            ]}
          />
        </Fig>
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">{ATTENDANCE_NOTE}</Text>
        </Card>
      </SpecSection>

      <SpecSection
        title="Three days, one dashboard"
        sub="The Aug 17-19 exchange, verbatim — carried forward from the Aug 19 report (Teams chat search hit Microsoft Graph rate limits before this thread could be re-pulled live this session). The Aug 19 12:38pm message was independently reconfirmed today via Outlook — exact timestamp match."
      >
        <ChatMessageList density="balanced">
          {groupChatTurns(CHAT_THREAD).map((turn) => {
            const first = turn[0];
            if (first.sender === 'system') {
              return (
                <ChatSystemMessage key={first.ts} variant="divider">
                  {first.who} · <Timestamp value={first.ts} format="date_time" hasTooltip={false} /> — {first.text}
                </ChatSystemMessage>
              );
            }
            return (
              <ChatMessage key={first.ts} sender={first.sender} avatar={<Avatar name={first.who} size="sm" />}>
                {turn.map((m, i) => (
                  <ChatMessageBubble
                    key={m.ts}
                    variant="filled"
                    group={turn.length === 1 ? undefined : i === 0 ? 'first' : i === turn.length - 1 ? 'last' : 'middle'}
                    name={i === 0 ? <Text type="supporting" weight="semibold" color="secondary">{first.who}</Text> : undefined}
                    metadata={
                      i === turn.length - 1 ? (
                        <ChatMessageMetadata
                          timestamp={<Timestamp value={m.ts} format="date_time" />}
                          footer={m.channel}
                        />
                      ) : undefined
                    }
                  >
                    {m.text}
                  </ChatMessageBubble>
                ))}
              </ChatMessage>
            );
          })}
        </ChatMessageList>
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Same-day reversal, in writing. The 9:29am meeting assigned &quot;build and deploy by evening.&quot; By 12:38pm — before evening, before a build existed — a full rewrite document arrived instead.
          </Text>
        </Card>
      </SpecSection>

      <SpecSection
        title="The Aug 20 deadline — still on the books, 6 days overdue"
        sub={'Five tracker rows carry the identical handwritten note, unchanged since it was written: "Vishal to work with Romit to close designs by 20th Aug." Two of those five have since moved to Design Freeze — the note is stale on those rows, not reflecting the actual state.'}
      >
        <Grid columns={{ minWidth: 200, max: 5 }} gap={3}>
          {DEADLINE_ROWS.map((r: DeadlineRow) => (
            <Card key={r.id} variant={r.stale ? 'yellow' : 'red'} padding={3}>
              <VStack gap={1.5}>
                <Text type="body" weight="semibold" as="p">{r.feature}</Text>
                <Text type="supporting">{r.designStatus}</Text>
                <HStack gap={1.5} vAlign="center">
                  <StatusDot variant={r.stale ? 'warning' : 'error'} label={r.stale ? 'stale note' : 'genuinely overdue'} />
                  <Text type="supporting">{r.stale ? 'Stale note' : 'Overdue'}</Text>
                </HStack>
              </VStack>
            </Card>
          ))}
        </Grid>
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            {staleDeadlines} of {DEADLINE_ROWS.length} rows are stale notes on work that&apos;s actually done (Create Survey/Distribution, Create Template);
            the rest are genuinely still blocked past the deadline.
          </Text>
        </Card>
      </SpecSection>

      <SpecSection title="Verification, Aug 26" sub="Same honesty convention as the rest of this corpus — floors, not totals; gaps shown, not hidden.">
        <MetadataList label={{ position: 'top' }}>
          <MetadataListItem label="Reverified today" icon={<Icon icon="success" color="success" size="sm" />}>
            <Text type="supporting" as="p" textWrap="pretty">{CLOSING_NOTE.reverifiedToday}</Text>
          </MetadataListItem>
          <MetadataListItem label="Carried forward, not re-verified this session" icon={<Icon icon="clock" color="secondary" size="sm" />}>
            <Text type="supporting" as="p" textWrap="pretty">{CLOSING_NOTE.carriedForward}</Text>
          </MetadataListItem>
          <MetadataListItem label="Explicit gaps" icon={<Icon icon="warning" color="warning" size="sm" />}>
            <Text type="supporting" as="p" textWrap="pretty">{CLOSING_NOTE.gaps}</Text>
          </MetadataListItem>
        </MetadataList>
      </SpecSection>
    </VStack>
  );
}
