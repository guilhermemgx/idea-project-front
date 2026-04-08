import { FormEvent, useMemo, useState } from "react";
import { CreateIdeaInput, Idea, UpdateIdeaInput } from "../types/idea";
import { toDateInputValue } from "../utils/date";

type CreateIdeaFormProps = {
  mode: "create";
  initialData?: Idea;
  onSubmit: (payload: CreateIdeaInput) => Promise<void>;
  isSubmitting?: boolean;
};

type EditIdeaFormProps = {
  mode: "edit";
  initialData?: Idea;
  onSubmit: (payload: UpdateIdeaInput) => Promise<void>;
  isSubmitting?: boolean;
};

type IdeaFormProps = CreateIdeaFormProps | EditIdeaFormProps;

type FormState = {
  author_re: string;
  what_can_be_improved: string;
  current_process: string;
  proposed_improvement: string;
  expected_benefit: string;
  registered_at: string;
};

export function IdeaForm(props: IdeaFormProps) {
  const { mode, initialData, isSubmitting = false } = props;

  const [form, setForm] = useState<FormState>({
    author_re: initialData?.author_re ?? "",
    what_can_be_improved: initialData?.what_can_be_improved ?? "",
    current_process: initialData?.current_process ?? "",
    proposed_improvement: initialData?.proposed_improvement ?? "",
    expected_benefit: initialData?.expected_benefit ?? "",
    registered_at: initialData?.registered_at
      ? toDateInputValue(initialData.registered_at)
      : new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = mode === "edit";

  const submitLabel = useMemo(
    () => (isEditMode ? "Salvar alterações" : "Cadastrar ideia"),
    [isEditMode],
  );

  function updateField(field: keyof FormState, value: string) {
    const formatterdValue = field === "author_re" ? value.replace(/\D/g, '') : value;

    setForm((current) => ({ ...current, [field]: formatterdValue }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!isEditMode && !form.author_re.trim()) {
      nextErrors.author_re = "Informe o RE do autor.";
    }

    if (!form.what_can_be_improved.trim()) {
      nextErrors.what_can_be_improved = "Informe o que pode ser melhorado.";
    }

    if (!form.current_process.trim()) {
      nextErrors.current_process = "Informe como é feito hoje.";
    }

    if (!form.proposed_improvement.trim()) {
      nextErrors.proposed_improvement = "Informe como pode ser melhorado.";
    }

    if (!form.expected_benefit.trim()) {
      nextErrors.expected_benefit = "Informe o benefício esperado.";
    }

    if (!isEditMode && !form.registered_at) {
      nextErrors.registered_at = "Informe a data de registro.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    if (mode === "edit") {
      const payload: UpdateIdeaInput = {
        what_can_be_improved: form.what_can_be_improved.trim(),
        current_process: form.current_process.trim(),
        proposed_improvement: form.proposed_improvement.trim(),
        expected_benefit: form.expected_benefit.trim(),
      };

      await props.onSubmit(payload);
      return;
    }

    const payload: CreateIdeaInput = {
      author_re: form.author_re.trim(),
      what_can_be_improved: form.what_can_be_improved.trim(),
      current_process: form.current_process.trim(),
      proposed_improvement: form.proposed_improvement.trim(),
      expected_benefit: form.expected_benefit.trim(),
      registered_at: form.registered_at,
    };

    await props.onSubmit(payload);
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="field-grid two-columns">
        <div className="field">
          <label htmlFor="author_re">RE do autor</label>
          <input
            id="author_re"
            value={form.author_re}
            onChange={(event) => updateField("author_re", event.target.value)}
            disabled={isEditMode}
            placeholder="Ex.: 123456"
          />
          {errors.author_re ? (
            <span className="field-error">{errors.author_re}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="registered_at">Data de registro</label>
          <input
            id="registered_at"
            type="date"
            value={form.registered_at}
            onChange={(event) =>
              updateField("registered_at", event.target.value)
            }
            disabled={isEditMode}
          />
          {errors.registered_at ? (
            <span className="field-error">{errors.registered_at}</span>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="what_can_be_improved">O que pode ser melhorado</label>
        <textarea
          id="what_can_be_improved"
          rows={4}
          value={form.what_can_be_improved}
          onChange={(event) =>
            updateField("what_can_be_improved", event.target.value)
          }
        />
        {errors.what_can_be_improved ? (
          <span className="field-error">{errors.what_can_be_improved}</span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="current_process">Como é feito hoje</label>
        <textarea
          id="current_process"
          rows={4}
          value={form.current_process}
          onChange={(event) =>
            updateField("current_process", event.target.value)
          }
        />
        {errors.current_process ? (
          <span className="field-error">{errors.current_process}</span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="proposed_improvement">Como pode ser melhorado</label>
        <textarea
          id="proposed_improvement"
          rows={4}
          value={form.proposed_improvement}
          onChange={(event) =>
            updateField("proposed_improvement", event.target.value)
          }
        />
        {errors.proposed_improvement ? (
          <span className="field-error">{errors.proposed_improvement}</span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="expected_benefit">Qual é o benefício</label>
        <textarea
          id="expected_benefit"
          rows={4}
          value={form.expected_benefit}
          onChange={(event) =>
            updateField("expected_benefit", event.target.value)
          }
        />
        {errors.expected_benefit ? (
          <span className="field-error">{errors.expected_benefit}</span>
        ) : null}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="button primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
