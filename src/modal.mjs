// src/modal.mjs

const modal = document.getElementById("screenshot-modal");
const modalImage = document.getElementById("modal-image");
const modalCloseBtn = document.getElementById("modal-close");

export function openModal(imageUrl) {
  if (!modal || !modalImage) return;
  modalImage.src = imageUrl;
  modal.classList.remove("hidden");
}

export function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
}

export function initModal() {
  if (!modal) return;

  // Close when clicking the X button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      closeModal();
    });
  }

  // Close when clicking outside the content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // ESC key closes the modal
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
