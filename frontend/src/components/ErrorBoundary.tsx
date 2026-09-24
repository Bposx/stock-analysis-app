import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100 mb-2">
            ເກີດຂໍ້ຜິດພາດໃນການສະແດງຜົນ (Rendering Error)
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 max-w-md mb-5 leading-relaxed">
            ລະບົບພົບບັນຫາຂະນະປະມວນຜົນຂໍ້ມູນກຣາບ ຫຼື ສ່ວນປະກອບໜ້າເວັບ. ກະລຸນາກົດໂຫຼດໃໝ່ ຫຼື ເລືອກຫຸ້ນອື່ນ.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <RefreshCw size={16} />
            <span>ໂຫຼດໜ້າເວັບໃໝ່ (Reload Page)</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
