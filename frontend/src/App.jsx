import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import './App.css';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  message: z.string().min(1, 'Message is required'),
  file: z.instanceof(File).optional(),
});

function FileDropzone({ value, onChange, error }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (accepted) => onChange(accepted[0]),
  });

  return (
    <div
      {...getRootProps({
        className: `dropzone${isDragActive ? ' dropzone--active' : ''}${error ? ' form__input--error' : ''}`,
      })}
    >
      <input {...getInputProps()} />
      <div className="dropzone__icon">📎</div>
      {value ? (
        <p className="dropzone__filename">{value.name}</p>
      ) : (
        <p className="dropzone__text">
          Drag &amp; drop a file here, or
          {' '}
          <span className="dropzone__browse">click to browse</span>
        </p>
      )}
    </div>
  );
}

FileDropzone.propTypes = {
  value: PropTypes.instanceOf(File),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.shape({ message: PropTypes.string }),
};

FileDropzone.defaultProps = {
  value: null,
  error: null,
};

function App() {
  const [response, setResponse] = React.useState(null);
  const [submitError, setSubmitError] = React.useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('message', data.message);
      if (data.file) {
        formData.append('file', data.file);
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      setResponse(json);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className="app">
      <h1 className="app__title">Form Submission</h1>

      <div className="form-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form__group">
            <label className="form__label" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className={`form__input${errors.name ? ' form__input--error' : ''}`}
              {...register('name')}
            />
            {errors.name && <span className="form__error">{errors.name.message}</span>}
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="message">Message</label>
            <input
              id="message"
              type="text"
              className={`form__input${errors.message ? ' form__input--error' : ''}`}
              {...register('message')}
            />
            {errors.message && <span className="form__error">{errors.message.message}</span>}
          </div>

          <div className="form__group">
            <span className="form__label">Attachment (optional)</span>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <FileDropzone
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.file}
                />
              )}
            />
            {errors.file && <span className="form__error">{errors.file.message}</span>}
          </div>

          <button
            type="submit"
            className="form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </div>

      {submitError && (
        <div className="alert alert--error">{submitError}</div>
      )}

      {response && (
        <div className="response">
          <h2 className="response__title">Response</h2>
          <pre className="response__pre">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
