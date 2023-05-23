import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { describe } from 'node:test';

import CountdownTimer from '../components/CountdownTimer';

beforeEach(() => {
  // タイマー関数をモックする
  jest.useFakeTimers();
  jest.spyOn(global, 'clearInterval');
});

afterEach(() => {
  jest.clearAllTimers();
});

describe('CountdownTimer', () => {
  it('should render the countdown timer', async () => {
    /** 準備 */
    /** ドロップ開始時間を、現在の時刻から1分後に設定する */
    const dropDate = new Date(Date.now() + 1000 * 60 * 1);

    render(<CountdownTimer dropDate={dropDate} />);

    act(() => {
      /** 1秒タイマーを進める */
      jest.advanceTimersByTime(1000);
    });

    /** 実行 */
    const textElement = screen.getByText(/Candy Drop Starting In/);
    const textTimerElement = screen.getByText(/⏰ 0d 0h 0m 59s/);

    /** 確認 */
    expect(textElement).toBeInTheDocument();
    expect(textTimerElement).toBeInTheDocument();
  });

  it('should clear the interval when the countdown reaches zero', () => {
    /** 準備 */
    /** ドロップ開始時間を、現在の時刻から1秒後に設定する */
    const dropDate = new Date(Date.now() + 1000 * 1);

    render(<CountdownTimer dropDate={dropDate} />);

    /** 実行 */
    act(() => {
      /** 2秒タイマーを進める */
      jest.advanceTimersByTime(2000);
    });

    /** 確認 */
    const textElement = screen.queryByText(/⏰/);

    expect(textElement).toBeNull();
    expect(clearInterval).toHaveBeenCalled();
  });

  it('should clear the interval when the component unmounts', async () => {
    const dropDate = new Date(Date.now() + 1000 * 60 * 1);
    const { unmount } = render(<CountdownTimer dropDate={dropDate} />);

    /** コンポーネントをアンマウントする */
    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });
});
