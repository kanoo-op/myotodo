"use client";

import { useEffect, useState, useCallback } from "react";
import { Todo } from "@/types/database";
import { getTodos } from "@/lib/todo-actions";
import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    const data = await getTodos();
    setTodos(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="space-y-6">
      <AddTodoForm onAdd={fetchTodos} />

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f
                ? "bg-white dark:bg-zinc-900 text-violet-600 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {f === "all" && `전체 (${todos.length})`}
            {f === "active" && `진행중 (${activeCount})`}
            {f === "completed" && `완료 (${completedCount})`}
          </button>
        ))}
      </div>

      {/* Todo List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-violet-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-zinc-500">로딩 중...</span>
          </div>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-violet-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            {filter === "all"
              ? "할 일을 추가해보세요!"
              : filter === "active"
              ? "진행 중인 할 일이 없습니다"
              : "완료된 할 일이 없습니다"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {todos.length > 0 && (
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
            <span>진행률</span>
            <span>
              {completedCount}/{todos.length} 완료
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
              style={{
                width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
