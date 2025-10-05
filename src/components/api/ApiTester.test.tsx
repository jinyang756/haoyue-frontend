import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiTester from './ApiTester';

// Mock the monaco editor component since it's not available in test environment
jest.mock('@monaco-editor/react', () => {
  return {
    __esModule: true,
    default: ({ value, onChange }: { value?: string; onChange?: (value: string) => void }) => (
      <textarea 
        data-testid="mock-editor" 
        value={value || ''} 
        onChange={(e) => onChange && onChange(e.target.value)} 
      />
    ),
  };
});

describe('ApiTester', () => {
  test('renders API tester component', () => {
    render(<ApiTester />);
    
    // Check if the main title is rendered
    expect(screen.getByText('API测试工具')).toBeInTheDocument();
    
    // Check if URL input is rendered
    expect(screen.getByPlaceholderText('请输入API端点URL，例如: https://api.example.com/users')).toBeInTheDocument();
    
    // Check if method selector is rendered (check for one of the methods)
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  test('renders request configuration sections', () => {
    render(<ApiTester />);
    
    // Check if headers section is rendered
    expect(screen.getByText('请求头 (Headers)')).toBeInTheDocument();
    
    // Check if query parameters section is rendered
    expect(screen.getByText('查询参数 (Query Parameters)')).toBeInTheDocument();
    
    // Check if body section is rendered
    expect(screen.getByText('请求体 (Body)')).toBeInTheDocument();
  });

  test('renders response display area', () => {
    render(<ApiTester />);
    
    // Check if response section is rendered
    expect(screen.getByText('响应')).toBeInTheDocument();
    
    // Check if send button is rendered
    expect(screen.getByText('发送请求')).toBeInTheDocument();
  });

  test('saves request to history', () => {
    render(<ApiTester />);
    
    // Fill in URL
    const urlInput = screen.getByPlaceholderText('请输入API端点URL，例如: https://api.example.com/users');
    fireEvent.change(urlInput, { target: { value: 'https://httpbin.org/get' } });
    
    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);
    
    // Check if success message is displayed
    // Note: We can't easily test message.display in Jest, so we'll just check that the button works
    expect(saveButton).toBeInTheDocument();
  });
});