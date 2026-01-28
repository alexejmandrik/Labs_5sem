const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql');

const sql = require('mssql');

const FacultyType = new GraphQLObjectType({
  name: 'Faculty',
  fields: {
    FACULTY: { type: GraphQLString },
    FACULTY_NAME: { type: GraphQLString }
  }
});

const TeacherType = new GraphQLObjectType({
  name: 'Teacher',
  fields: {
    TEACHER: { type: GraphQLString },
    TEACHER_NAME: { type: GraphQLString },
    PULPIT: { type: GraphQLString }
  }
});

const PulpitType = new GraphQLObjectType({
  name: 'Pulpit',
  fields: {
    PULPIT: { type: GraphQLString },
    PULPIT_NAME: { type: GraphQLString },
    FACULTY: { type: GraphQLString }
  }
});

const SubjectType = new GraphQLObjectType({
  name: 'Subject',
  fields: {
    SUBJECT: { type: GraphQLString },
    SUBJECT_NAME: { type: GraphQLString },
    PULPIT: { type: GraphQLString }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {

    getFaculties: {
      type: new GraphQLList(FacultyType),
      args: { faculty: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const req = pool.request();
        if (args.faculty)
          return (await req.query(
            `SELECT * FROM FACULTY WHERE FACULTY='${args.faculty}'`
          )).recordset;
        return (await req.query('SELECT * FROM FACULTY')).recordset;
      }
    },

    getTeachers: {
      type: new GraphQLList(TeacherType),
      args: { teacher: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const req = pool.request();
        if (args.teacher)
          return (await req.query(
            `SELECT * FROM TEACHER WHERE TEACHER='${args.teacher}'`
          )).recordset;
        return (await req.query('SELECT * FROM TEACHER')).recordset;
      }
    },

    getPulpits: {
      type: new GraphQLList(PulpitType),
      args: { pulpit: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const req = pool.request();
        if (args.pulpit)
          return (await req.query(
            `SELECT * FROM PULPIT WHERE PULPIT='${args.pulpit}'`
          )).recordset;
        return (await req.query('SELECT * FROM PULPIT')).recordset;
      }
    },

    getSubjects: {
      type: new GraphQLList(SubjectType),
      args: { subject: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const req = pool.request();
        if (args.subject)
          return (await req.query(
            `SELECT * FROM SUBJECT WHERE SUBJECT='${args.subject}'`
          )).recordset;
        return (await req.query('SELECT * FROM SUBJECT')).recordset;
      }
    },

    getTeachersByFaculty: {
      type: new GraphQLList(TeacherType),
      args: { faculty: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const r = await pool.request().query(`
          SELECT * FROM TEACHER
          WHERE PULPIT IN (
            SELECT PULPIT FROM PULPIT WHERE FACULTY='${args.faculty}'
          )
        `);
        return r.recordset;
      }
    },

    getSubjectsByFaculties: {
      type: new GraphQLList(SubjectType), // можно сделать специальный тип с pulpit + subjects
      args: { faculty: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const r = await pool.request().query(`
          SELECT P.PULPIT, P.PULPIT_NAME, S.SUBJECT, S.SUBJECT_NAME
          FROM PULPIT P
          LEFT JOIN SUBJECT S ON S.PULPIT = P.PULPIT
          WHERE P.FACULTY='${args.faculty}'
        `);
        return r.recordset;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    setFaculty: {
      type: FacultyType,
      args: {
        faculty: { type: GraphQLString },
        faculty_name: { type: GraphQLString }
      },
      async resolve(_, args, { pool }) {
        await pool.request().query(`
          MERGE FACULTY AS T
          USING (SELECT '${args.faculty}' FACULTY, N'${args.faculty_name}' FACULTY_NAME) S
          ON T.FACULTY = S.FACULTY
          WHEN MATCHED THEN UPDATE SET FACULTY_NAME=S.FACULTY_NAME
          WHEN NOT MATCHED THEN INSERT VALUES (S.FACULTY, S.FACULTY_NAME);
        `);
        return { FACULTY: args.faculty, FACULTY_NAME: args.faculty_name };
      }
    },

    delFaculty: {
      type: GraphQLBoolean,
      args: { faculty: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const r = await pool.request().query(
          `DELETE FROM FACULTY WHERE FACULTY='${args.faculty}'`
        );
        return r.rowsAffected[0] > 0;
      }
    },

    /* ===== TEACHER ===== */

    setTeacher: {
      type: TeacherType,
      args: {
        teacher: { type: GraphQLString },
        teacher_name: { type: GraphQLString },
        pulpit: { type: GraphQLString }
      },
      async resolve(_, args, { pool }) {
        await pool.request().query(`
          MERGE TEACHER AS T
          USING (
            SELECT '${args.teacher}' TEACHER,
                  N'${args.teacher_name}' TEACHER_NAME,
                  '${args.pulpit}' PULPIT
          ) S
          ON T.TEACHER = S.TEACHER
          WHEN MATCHED THEN
            UPDATE SET
              TEACHER_NAME = S.TEACHER_NAME,
              PULPIT = S.PULPIT
          WHEN NOT MATCHED THEN
            INSERT VALUES (S.TEACHER, S.TEACHER_NAME, S.PULPIT);
        `);

        return {
          TEACHER: args.teacher,
          TEACHER_NAME: args.teacher_name,
          PULPIT: args.pulpit
        };
      }
    },


    delTeacher: {
      type: GraphQLBoolean,
      args: { teacher: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const r = await pool.request().query(
          `DELETE FROM TEACHER WHERE TEACHER='${args.teacher}'`
        );
        return r.rowsAffected[0] > 0;
      }
    },

    /* ===== PULPIT ===== */

    setPulpit: {
      type: PulpitType,
      args: {
        pulpit: { type: GraphQLString },
        pulpit_name: { type: GraphQLString },
        faculty: { type: GraphQLString }
      },
      async resolve(_, args, { pool }) {
        await pool.request().query(`
          MERGE PULPIT AS T
          USING (
            SELECT '${args.pulpit}' PULPIT,
                   N'${args.pulpit_name}' PULPIT_NAME,
                   '${args.faculty}' FACULTY
          ) S
          ON T.PULPIT = S.PULPIT
          WHEN MATCHED THEN
            UPDATE SET PULPIT_NAME=S.PULPIT_NAME, FACULTY=S.FACULTY
          WHEN NOT MATCHED THEN
            INSERT VALUES (S.PULPIT, S.PULPIT_NAME, S.FACULTY);
        `);
        return {
          PULPIT: args.pulpit,
          PULPIT_NAME: args.pulpit_name,
          FACULTY: args.faculty
        };
      }
    },

    delPulpit: {
      type: GraphQLBoolean,
      args: { pulpit: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const r = await pool.request().query(
          `DELETE FROM PULPIT WHERE PULPIT='${args.pulpit}'`
        );
        return r.rowsAffected[0] > 0;
      }
    },

    /* ===== SUBJECT ===== */

    setSubject: {
      type: SubjectType,
      args: {
        subject: { type: GraphQLString },
        subject_name: { type: GraphQLString },
        pulpit: { type: GraphQLString }
      },
      async resolve(_, args, { pool }) {
        await pool.request().query(`
          MERGE SUBJECT AS T
          USING (
            SELECT '${args.subject}' SUBJECT,
                   N'${args.subject_name}' SUBJECT_NAME,
                   '${args.pulpit}' PULPIT
          ) S
          ON T.SUBJECT = S.SUBJECT
          WHEN MATCHED THEN
            UPDATE SET SUBJECT_NAME=S.SUBJECT_NAME, PULPIT=S.PULPIT
          WHEN NOT MATCHED THEN
            INSERT VALUES (S.SUBJECT, S.SUBJECT_NAME, S.PULPIT);
        `);
        return {
          SUBJECT: args.subject,
          SUBJECT_NAME: args.subject_name,
          PULPIT: args.pulpit
        };
      }
    },

    delSubject: {
      type: GraphQLBoolean,
      args: { subject: { type: GraphQLString } },
      async resolve(_, args, { pool }) {
        const r = await pool.request().query(
          `DELETE FROM SUBJECT WHERE SUBJECT='${args.subject}'`
        );
        return r.rowsAffected[0] > 0;
      }
    }

  }
});

module.exports = new GraphQLSchema({ query: Query, mutation: Mutation });
