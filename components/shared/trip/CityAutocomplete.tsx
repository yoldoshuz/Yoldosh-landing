"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Твой API ключ (лучше вынести в .env файл как NEXT_PUBLIC_GEOAPIFY_KEY)
const API_KEY = "a61eb8573a044553893463381f370395";

interface CityAutocompleteProps {
  placeholder: string;
  initialValue?: string;
  onCitySelected: (normalizedCity: string) => void;
  className?: string;
}

// Тип для подсказки от Geoapify
interface GeoapifyFeature {
  properties: {
    formatted: string; // Полный адрес для отображения
    city?: string;     // Город (Tashkent)
    state?: string;    // Область/Штат
    country?: string;  // Страна
    place_id: string;
    address_line1?: string; // Например "Улица Пушкина"
    address_line2?: string; // Например "Ташкент, Узбекистан"
  };
}

export const CityAutocomplete = ({
  placeholder,
  initialValue,
  onCitySelected,
  className,
}: CityAutocompleteProps) => {
  // То, что видит пользователь (может быть на русском)
  const [displayValue, setDisplayValue] = useState(initialValue || "");

  // Результаты поиска
  const [results, setResults] = useState<GeoapifyFeature[]>([]);

  // Состояния UI
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Хук debounce: ждем 300мс после остановки ввода, прежде чем тратить лимит запросов
  const [debouncedValue] = useDebounce(displayValue, 300);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Функция запроса к Geoapify
  const searchPlaces = async (text: string) => {
    if (!text || text.length < 2) return;

    setIsLoading(true);
    try {
      const config = {
        method: 'get',
        url: `https://api.geoapify.com/v1/geocode/autocomplete`,
        params: {
          text: text,
          apiKey: API_KEY,
          lang: 'en', // ВАЖНО: Просим результат на английском для БД!
          limit: 5,
          type: 'city', // Можно убрать, если хочешь искать и улицы, но для трипов лучше города
        }
      };

      const response = await axios(config);
      setResults(response.data.features || []);
    } catch (error) {
      console.error("Geoapify Error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Эффект при изменении текста (с задержкой)
  useEffect(() => {
    if (debouncedValue && isOpen) {
      searchPlaces(debouncedValue);
    } else if (!debouncedValue) {
      setResults([]);
      onCitySelected(""); // Очищаем фильтр, если поле пустое
    }
  }, [debouncedValue]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (feature: GeoapifyFeature) => {
    const props = feature.properties;

    // 1. Нормализация для базы данных
    // Берем city, если нет - state (для областей), если нет - formatted
    // Благодаря lang='en' в запросе, тут будет "Tashkent", а не "Ташкент"
    const normalizedName = props.city || props.state || props.formatted.split(',')[0];

    console.log("User saw:", props.formatted);
    console.log("DB will get:", normalizedName);

    // 2. Обновляем инпут (показываем пользователю красивое название)
    // Можно показывать props.formatted, но часто удобнее просто город
    setDisplayValue(props.formatted);

    // 3. Отдаем родителю чистое имя
    onCitySelected(normalizedName);

    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
    if (!isOpen) setIsOpen(true);
    if (e.target.value === "") {
      onCitySelected("");
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <Input
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => displayValue && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "border-none shadow-none p-0 h-auto text-base font-medium placeholder:text-muted-foreground focus-visible:ring-0 pr-8",
            className
          )}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-0 top-0 h-full flex items-center pr-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Выпадающий список */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 top-full left-0 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((item) => (
            <li
              key={item.properties.place_id}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-neutral-50 cursor-pointer flex items-center gap-3 transition-colors text-sm border-b last:border-0"
            >
              <MapPin className="size-4 text-emerald-500 shrink-0" />
              <div className="flex flex-col text-left">
                {/* Первая строка: Название (Улица или Город) */}
                <span className="font-medium text-neutral-900">
                  {item.properties.address_line1 || item.properties.formatted.split(',')[0]}
                </span>
                {/* Вторая строка: Детали (Страна, Область) */}
                <span className="text-xs text-neutral-500 line-clamp-1">
                  {item.properties.address_line2 || item.properties.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Состояние "Ничего не найдено" */}
      {isOpen && !isLoading && results.length === 0 && debouncedValue.length > 2 && (
        <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white border rounded-lg shadow-lg p-4 text-sm text-neutral-500 text-center">
          Ничего не найдено
        </div>
      )}
    </div>
  );
};