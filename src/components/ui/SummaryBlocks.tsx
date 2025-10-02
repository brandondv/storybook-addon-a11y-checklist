import React from "react";
import { styled } from "@storybook/theming";

const SummaryContainer = styled.div({
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  flexWrap: "nowrap",
});

const SummaryBlock = styled.div<{ color: string }>(({ color }) => ({
  border: `2px solid ${color}`,
  color: "white",
  padding: "20px",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "bold",
  minWidth: "80px",
  textAlign: "center",
  flex: 1,
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
      <SummaryBlock color="white">Total: {summary.total}</SummaryBlock>
      {summary.unknown > 0 && (
        <SummaryBlock color="#ff8400ff">
          ? {summary.unknown} Unknown
        </SummaryBlock>
      )}
      {summary.passed > 0 && (
        <SummaryBlock color="#28a745">✓ {summary.passed} Passed</SummaryBlock>
      )}
      {summary.failed > 0 && (
        <SummaryBlock color="#dc3545">✗ {summary.failed} Failed</SummaryBlock>
      )}
      {summary.not_applicable > 0 && (
        <SummaryBlock color="#6c757d">
          {summary.not_applicable} N/A
        </SummaryBlock>
      )}
    </SummaryContainer>
  );
};
