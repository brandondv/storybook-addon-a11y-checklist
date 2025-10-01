import React from "react";
import { styled } from "storybook/theming";

const SummaryContainer = styled.div({
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  flexWrap: "wrap",
});

const SummaryBlock = styled.div<{ color: string }>(({ color }) => ({
  backgroundColor: color,
  color: "white",
  padding: "8px 12px",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "bold",
  minWidth: "80px",
  textAlign: "center",
}));

interface SummaryData {
  passed: number;
  failed: number;
  unknown: number;
  not_applicable: number;
  total: number;
}

interface SummaryBlocksProps {
  summary: SummaryData;
}

export const SummaryBlocks: React.FC<SummaryBlocksProps> = ({ summary }) => {
  return (
    <SummaryContainer>
      <SummaryBlock color="#28a745">
        ✓ {summary.passed} Passed
      </SummaryBlock>
      <SummaryBlock color="#dc3545">
        ✗ {summary.failed} Failed
      </SummaryBlock>
      <SummaryBlock color="#6c757d">
        {summary.not_applicable} N/A
      </SummaryBlock>
      <SummaryBlock color="#ff8400ff">
        ? {summary.unknown} Unknown
      </SummaryBlock>
      <SummaryBlock color="#007bff">
        Total: {summary.total}
      </SummaryBlock>
    </SummaryContainer>
  );
};