import React from "react";

interface Props {
  html: string;
  className?: string;
}

const HtmlContent: React.FC<Props> = ({ html, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HtmlContent;
