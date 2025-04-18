'use client';

import { useState, startTransition } from 'react';
import { handleSubmit } from '@/app/signup/actions';
import { useResetableActionState } from 'use-resetable-action-state';

//handling the input fields with error messages
const InputField = ({ name, type, placeholder, defaultValue, error }) => (
  <div className="flex flex-col space-y-1">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-6 py-3 border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-xl transition duration-300 ease-in-out"
    />
    {error && (
      <div className="text-red-500 text-sm">
        {error.map((err, index) => (
          <p key={index} className="mt-1">{err}</p>
        ))}
      </div>
    )}
  </div>
);

//toggle between candidate and business forms
const ToggleFormButton = ({ isBusiness, toggleForm }) => (
  <div className="flex justify-center items-center space-x-6 mt-6">
    <button
      type="button"
      onClick={() => toggleForm('candidate')}
      className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform ${
        !isBusiness
          ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105'
          : 'bg-zinc-500 text-zinc-300 hover:bg-zinc-600'
      }`}
    >
      Candidate
    </button>
    <button
      type="button"
      onClick={() => toggleForm('business')}
      className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform ${
        isBusiness
          ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105'
          : 'bg-zinc-500 text-zinc-300 hover:bg-zinc-600'
      }`}
    >
      Business
    </button>
  </div>
);

//handling the submit button behavior
const SubmitButton = ({ isPending, justReset }) => (
  <button
    type="submit"
    disabled={isPending && !justReset}
    className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
      isPending && !justReset
        ? 'bg-blue-300 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 shadow-xl transform hover:scale-105'
    }`}
  >
    {isPending && !justReset ? 'Pending...' : 'Submit'}
  </button>
);

export default function SignUp() {
  const [isBusiness, setIsBusiness] = useState(false);
  const [justReset, setJustReset] = useState(false); // Fix bug with resetable action state toggling button

  const [state, formAction, isPending, reset] = useResetableActionState(
    (state, formData) => handleSubmit(state, formData, isBusiness),
    {}
  );

  // Function to toggle between business and candidate forms
  const toggleForm = (value) => {
    const newIsBusiness = value === 'business';
    if (newIsBusiness !== isBusiness) {
      setIsBusiness(newIsBusiness);
      setJustReset(true);
      startTransition(() => {
        reset();
      });
      setTimeout(() => setJustReset(false), 100);
    }
  };

  const formFields = isBusiness
    ? [
        { name: 'business_name', type: 'text', placeholder: 'Business Name' },
        { name: 'business_email', type: 'email', placeholder: 'Business Email' },
        { name: 'position_title', type: 'text', placeholder: 'Position Title' },
      ]
    : [
        { name: 'first_name', type: 'text', placeholder: 'First Name' },
        { name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { name: 'email', type: 'email', placeholder: 'Email' },
      ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-16 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-center">
      <form
        action={formAction}
        className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-lg w-full max-w-md space-y-6 transform hover:scale-105 transition-all duration-300"
      >
        <h2 className="text-4xl font-bold sm:text-5xl tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 text-center mx-auto transform space-y-2">
          {isBusiness ? 'Business Sign Up' : 'Candidate Sign Up'}
        </h2>

        {state?.message && (
          <div className="text-red-500 text-sm text-center">{state.message}</div>
        )}

        {/* Conditional Form Fields */}
        {formFields.map(({ name, type, placeholder }) => (
          <InputField
            key={name}
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={state?.default_values?.[name] || ''}
            error={state?.errors?.[name] || []}
          />
        ))}

        <InputField
          name="password"
          type="password"
          placeholder="Password"
          defaultValue={state?.default_values?.password || ''}
          error={state?.errors?.password || []}
        />
        <InputField
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          defaultValue={state?.default_values?.confirm_password || ''}
          error={state?.errors?.confirm_password || []}
        />

        {/* Toggle Form Buttons */}
        <ToggleFormButton isBusiness={isBusiness} toggleForm={toggleForm} />

        {/* Submit Button */}
        <SubmitButton isPending={isPending} justReset={justReset} />
      </form>
    </div>
  );
}
