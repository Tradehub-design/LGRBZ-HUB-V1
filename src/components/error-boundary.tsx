"use client";

import React, { ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error);
    console.error(info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow">
            <h1 className="text-2xl font-bold">
              Something went wrong.
            </h1>

            <p className="mt-3 text-slate-500">
              Please refresh the application.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
