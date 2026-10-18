import FeedbackForm from "./components/FeedbackForm";
import "./App.css"; // Убедитесь, что файл существует, если нет - создайте или удалите импорт

function App() {
  return (
    <div className="app">
      <h1 style={{ textAlign: "center", fontFamily: "system-ui", marginTop: "40px" }}>
        Форма обратной связи
      </h1>
      <FeedbackForm />
    </div>
  );
}

export default App;