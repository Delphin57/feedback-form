import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  // --- Состояние значений полей ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Задание 2
  const [message, setMessage] = useState("");
  
  // Задание 3: Состояние переключателя
  const [wantReply, setWantReply] = useState(false); 

  // --- Состояние ошибки валидации ---
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null, // Задание 2
    message: null,
  });

  // --- Состояние процесса отправки ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Состояние «тронутых» полей ---
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false, // Задание 2
    message: false,
  });

  // --- Состояние успешной отправки ---
  const [submitted, setSubmitted] = useState(false);

  // ==========================================
  // ФУНКЦИИ ВАЛИДАЦИИ
  // ==========================================

  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value)) {
      return "Только буквы, пробелы и дефис";
    }
    return null;
  };

  // Задание 3: Зависимая валидация Email
  const validateEmail = (value, isReplyWanted = wantReply) => {
    // Если поле пустое и ответ не нужен — ошибки нет
    if (!value.trim()) {
      return isReplyWanted ? "Email обязателен для заполнения" : null;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Некорректный формат email";
    }
    return null;
  };

  // Задание 2: Валидация телефона
  const validatePhone = (value) => {
    if (!value.trim()) return "Телефон обязателен для заполнения";
    // Проверка на полное заполнение маски
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value)) {
      return "Введите номер полностью";
    }
    return null;
  };

  // Задание 1: Валидация длины сообщения
  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    if (value.length > 500) return "Максимум 500 символов"; // Верхний лимит
    return null;
  };

  const validators = {
    name: validateName,
    email: (val) => validateEmail(val, wantReply),
    phone: validatePhone,
    message: validateMessage,
  };

  // ==========================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ==========================================

  // Задание 2: Функция форматирования телефона (маска)
  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, ""); // Удаляем все не-цифры
    if (!digits) return "";

    // Заменяем первую 8 на 7
    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    } else if (!digits.startsWith("7")) {
      digits = "7" + digits;
    }

    let formatted = "+7 ";
    if (digits.length > 1) formatted += "(" + digits.substring(1, 4);
    if (digits.length >= 5) formatted += ") " + digits.substring(4, 7);
    if (digits.length >= 8) formatted += "-" + digits.substring(7, 9);
    if (digits.length >= 10) formatted += "-" + digits.substring(9, 11);
    
    return formatted.trim();
  };

  // ==========================================
  // ОБРАБОТЧИКИ
  // ==========================================

  const handleChange = (field, value) => {
    let finalValue = value;

    // Применяем маску для телефона
    if (field === "phone") {
      finalValue = formatPhone(value);
    }

    // Обновляем состояние
    switch (field) {
      case "name": setName(finalValue); break;
      case "email": setEmail(finalValue); break;
      case "phone": setPhone(finalValue); break;
      case "message": setMessage(finalValue); break;
      default: break;
    }

    // Live-валидация для тронутых полей
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](finalValue),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentValue = field === "name" ? name : field === "email" ? email : field === "phone" ? phone : message;
    
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](currentValue),
    }));
  };

  // Задание 3: Обработчик чекбокса
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setWantReply(isChecked);
    
    // Если поле Email уже "тронуто", сразу перепроверяем его с новыми правилами
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email, isChecked),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email, wantReply),
      phone: validatePhone(phone),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const getInputClass = (field) => {
    const classes = ["field__input"];
    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field] && (field !== "email" || wantReply || email)) {
      // Для Email класс успеха даем только если он заполнен или обязателен
      classes.push("field__input--valid");
    }
    if (field === "message") classes.push("field__input--textarea");
    return classes.join(" ");
  };

  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">Мы свяжемся с вами в ближайшее время.</p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName(""); setEmail(""); setPhone(""); setMessage("");
            setWantReply(false);
            setErrors({ name: null, email: null, phone: null, message: null });
            setTouched({ name: false, email: false, phone: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      {/* Поле «Имя» */}
      <div className="field">
        <label htmlFor="name" className="field__label">Имя</label>
        <input
          id="name" type="text" className={getInputClass("name")}
          value={name} onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && <span className="field__error">{errors.name}</span>}
      </div>

      {/* Задание 3: Чекбокс */}
      <div className="field field--checkbox">
        <label className="field__label checkbox-label">
          <input
            type="checkbox"
            checked={wantReply}
            onChange={handleCheckboxChange}
          />
          Хочу получить ответ
        </label>
      </div>

      {/* Поле «Email» */}
      <div className="field">
        <label htmlFor="email" className="field__label">Email {wantReply && <span style={{ color: '#e5484d' }}>*</span>}</label>
        <input
          id="email" type="email" className={getInputClass("email")}
          value={email} onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && <span className="field__error">{errors.email}</span>}
      </div>

      {/* Задание 2: Поле «Телефон» */}
      <div className="field">
        <label htmlFor="phone" className="field__label">Телефон</label>
        <input
          id="phone" type="tel" className={getInputClass("phone")}
          placeholder="+7 (___) ___-__-__"
          value={phone} onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
        />
        {touched.phone && errors.phone && <span className="field__error">{errors.phone}</span>}
      </div>

      {/* Поле «Сообщение» */}
      <div className="field">
        <label htmlFor="message" className="field__label">Сообщение</label>
        <textarea
          id="message" className={getInputClass("message")}
          value={message} onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={500} // Задание 1: Ограничение ввода
        />
        {/* Задание 1: Счётчик символов */}
        <div className="field__counter" style={{ color: message.length >= 500 ? '#e5484d' : '#667085' }}>
          {message.length} / 500
        </div>
        {touched.message && errors.message && <span className="field__error">{errors.message}</span>}
      </div>

      <button type="submit" className="feedback-form__submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;