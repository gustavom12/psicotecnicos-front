export const Notification = (message: string, type: "success" | "error") => {
  // TODO, Cambiar por Alert en NextUI cuando exista
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
};
