import { useEffect, useState } from 'react';
import { getPatchDelta } from './form-lib/utils/getPatchDelta';
import { Form } from './form-lib/components/Form';
import { Textbox } from './form-lib/components/Textbox';
import { v } from './form-lib/utils/validation';
import { ValidatorsFor } from './form-lib/types/ValidatorsFor';
import { FormBucket } from './form-lib/types/FormBucket';

/* ---- mocking some example-data & -behavior ---- */

interface Person {
  id: number;
  firstname: string;
  lastname: string;
  birthday: string;
}

const examplePerson: Person = {
  id: 1,
  firstname: 'J',
  lastname: 'Doe',
  birthday: '1990-04-01',
};

const fetchPerson = (): Promise<Person> =>
  new Promise((res) => setTimeout(() => res(examplePerson), 500));

const patchPerson = (id: number, person: Partial<Person>): Promise<Person> =>
  new Promise((res) => setTimeout(() => res({ ...examplePerson, id, ...person }), 500));

const validators: ValidatorsFor<Person> = {
  id: [v.required()],
  firstname: [v.required(), v.minLength(2, 'Please enter a real first name')],
  lastname: [v.required(), v.minLength(2, 'Please enter a real last name')],
  birthday: [
    v.required(),
    v.pattern(/\d{4}-\d{2}-\d{2}/, 'Please enter a valid birthday in the specified format'),
  ],
};

/* ---- Using it inside the actual app-component ---- */

export const App = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchPerson().then(setPerson);
  }, []);

  const handleSubmit = ({ values, initialValues }: FormBucket<Person>) => {
    if (!values || !person) return;

    const delta = getPatchDelta<Person>(initialValues, values);

    console.log('Patching:', delta);

    return patchPerson(person.id, delta)
      .then((data) => {
        console.log('Updated successfully. Response:', data);
        setSuccessMsg('Updated successfully');
        setTimeout(() => setSuccessMsg(''), 3000);
        setPerson(data);
      })
      .catch((err) => console.error('Error while updating book. Error:', err));
  };

  return (
    <>
      <section>
        <h1>react-easy-form-lib</h1>
      </section>

      {!person ? (
        <div>
          <em>Loading...</em>
        </div>
      ) : (
        <Form onFormSubmit={handleSubmit} initialValues={person} validators={validators}>
          {(formBucket) => (
            <>
              <Textbox label="First Name" name="firstname" />
              <Textbox label="Last Name" name="lastname" />
              <Textbox label="Birthday" name="birthday" type="date" />

              <button type="submit" disabled={!formBucket.hasChanged}>
                Save
              </button>

              {formBucket.isSubmitting && <div>Updating...</div>}
              {successMsg && <div>{successMsg}</div>}

              <pre>{JSON.stringify({ ...formBucket, validators: undefined }, null, 2)}</pre>
            </>
          )}
        </Form>
      )}
    </>
  );
};
