import { Boolean, Number, Object, String } from 'runtypes';
import { createCase } from '../benchmarks';

createCase('runtypes', 'assertLoose', () => {
  const dataType = Object({
    number: Number,
    negNumber: Number,
    maxNumber: Number,
    string: String,
    longString: String,
    boolean: Boolean,
    deeplyNested: Object({
      foo: String,
      num: Number,
      bool: Boolean,
    }),
  });

  return data => {
    dataType.check(data);

    return true;
  };
});
