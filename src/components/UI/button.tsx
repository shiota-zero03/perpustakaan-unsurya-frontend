import { Button } from "@nextui-org/react";
import React from "react";

interface Props {
  className: string;
  type?: 'button' | 'submit' | 'reset';
  content: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onPress?: () => void;
  radius?: 'sm' | 'md' | 'lg' | 'full' | 'none';
  isLoading?: boolean;
}

const ButtonSolid: React.FC<Props> = ({
  className,
  type = 'button',
  content,
  startContent,
  endContent,
  radius = 'sm',
  isLoading = false,
  onPress
}) => {
  return (
    <Button
        variant="solid"
        className={className}
        radius={radius}
        type={type}
        startContent={startContent}
        endContent={endContent}
        onPress={onPress}
        isLoading={isLoading}
    >
        {content}
    </Button>
  );
};

const ButtonBordered: React.FC<Props> = ({
    className,
    type = 'button',
    content,
    startContent,
    endContent,
    radius = 'sm',
    onPress,
    isLoading = false,
  }) => {
    return (
      <Button
        variant="bordered"
        className={className}
        type={type}
        startContent={startContent}
        endContent={endContent}
        radius={radius}
        onPress={onPress}
        isLoading={isLoading}
      >
        {content}
      </Button>
    );
  };
  

export { ButtonSolid, ButtonBordered };
